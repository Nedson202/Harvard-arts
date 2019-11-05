import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';

import { compose, withApollo } from 'react-apollo';

import debounce from 'lodash.debounce';
import queryString from 'querystring';
import setQuery from 'set-query-string';

import Spinner from '../Preloader/Spinner';

import searchQuery from './query';

import { objectsQuery } from '../Collections/query';

import { runNetworkQuery } from '../../utils';

import {
  CLIP_BOARD_DATA_TYPE, COLLECTIONS_PATH, COLLECTIONS_TYPENAME,
  PREVIOUS_LOCATION, SEARCH_PATH,
} from '../../settings';

import { EventObject, ISearchProps, ISearchState } from '../../../types';

class Search extends PureComponent<ISearchProps, ISearchState> {
  public state = {
    value: '',
    toggleCloseIcon: false,
    runningSearch: false,
  };

  public debounceSearch = debounce(async (value: string) => {
    if (!value.trim().length) {
      return;
    }

    this.setState({ runningSearch: true });

    const response: any = await runNetworkQuery(searchQuery, value);
    let resultsToDisplay: object[] = [];

    this.setState({ runningSearch: false });

    if (response.data) {
      const { searchResults } = response.data;

      resultsToDisplay = searchResults.results || [];
    }

    this.writeQueryToCache(resultsToDisplay);
  }, 1000);

  public componentDidMount() {
    this.setInputFromQuery();
  }

  public setInputFromQuery() {
    const query = queryString.parse(window.location.search);

    if (Object.keys(query)[0] && Object.keys(query)[0] === SEARCH_PATH) {
      const queryValue: any = Object.values(query)[0];
      this.setState({
        value: queryValue || '',
        toggleCloseIcon: queryValue && true,
      });

      if (queryValue.trim().length) {
        return this.debounceSearch(queryValue);
      }
    }
  }

  public onInputChange = (event: EventObject) => {
    event.preventDefault();
    const { name, value } = event.target;
    const { history } = this.props;

    if (value.trim().length === 1) {
      history.push({
        ...history.location,
        pathname: COLLECTIONS_PATH,
      });
    }

    this.setState({ [name]: value }, () => {
      const { value: searchQueryData } = this.state;
      const queryData = searchQueryData.trim().length > 0;

      this.setState({ toggleCloseIcon: queryData });

      setQuery({ search: searchQueryData });
      this.debounceSearch(searchQueryData);
    });

    if (!value.trim().length) {
      return this.clearSearchQuery();
    }
  }

  public clearSearchQuery = () => {
    const { history } = this.props;

    this.setState({ value: '', toggleCloseIcon: false });
    setQuery({ search: '' });

    history.push(localStorage.PREVIOUS_LOCATION);
    localStorage.removeItem(PREVIOUS_LOCATION);

    runNetworkQuery(objectsQuery, '');

    this.setState({ runningSearch: false });
  }

  public handleInputFocus = () => {
    const { history: { location } } = this.props;

    if (location.pathname !== COLLECTIONS_PATH) {
      localStorage.setItem(PREVIOUS_LOCATION, location.pathname);
    }
  }

  public handleReset = () => {
    const { history } = this.props;
    const { value } = this.state;

    if (!value.trim()) {
      setQuery({ search: null });

      history.push(localStorage.PREVIOUS_LOCATION);

      return localStorage.removeItem(PREVIOUS_LOCATION);
    }
  }

  public handleDataPaste = (event: any) => {
    const { clipboardData } = event;
    const { history } = this.props;
    const query: any = clipboardData.getData(CLIP_BOARD_DATA_TYPE);

    if (query.trim().length) {
      history.push({
        ...history.location,
        pathname: COLLECTIONS_PATH,
      });

      return this.debounceSearch(query);
    }
  }

  public writeQueryToCache(results: object[]) {
    const { client } = this.props;

    client.writeQuery({
      query: objectsQuery,
      data: {
        objects: {
          records: results,
          __typename: COLLECTIONS_TYPENAME,
        },
      },
      variables: { size: 24, page: 1 },
    });
  }

  public disableSearchOnEnter = (event: any) => {
    if (event.which === 13 /* Enter */) {
      event.preventDefault();
    }
  }

  public renderCloseIcon() {
    const { toggleCloseIcon } = this.state;

    if (!toggleCloseIcon) {
      return;
    }

    return (
      <div>
        <button
          className='close-icon'
          onClick={this.clearSearchQuery}
          type='button'
        >
          &times;
        </button>
      </div>
    );
  }

  public renderSearchActiveSpinner() {
    const { runningSearch } = this.state;

    if (!runningSearch) {
      return;
    }

    return (
      <Spinner
        disableTip={true}
        size={25}
      />
    );
  }

  public render() {
    const { value } = this.state;

    return (
      <form
        onKeyPress={this.disableSearchOnEnter}
      >
        <input
          aria-label='Search'
          autoComplete='off'
          className='search'
          id='searchBox'
          name='value'
          onBlur={this.handleReset}
          onChange={this.onInputChange}
          onFocus={this.handleInputFocus}
          onPaste={this.handleDataPaste}
          placeholder='Search by title, century, culture, department, culture...'
          type='search'
          value={value}
        />
        {this.renderCloseIcon()}
        {this.renderSearchActiveSpinner()}
      </form>
    );
  }
}

export default withRouter(compose(
  withApollo,
)(Search));
