import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'querystring';
import setQuery from 'set-query-string';
import debounce from 'lodash.debounce';
import { compose, withApollo } from 'react-apollo';

import Spinner from '../Preloader/Spinner';

import searchQuery from './query';
import { objectsQuery } from '../Collections/query';
import { runNetworkQuery } from '../../utils';
import {
  searchPath, previousLocation, collectionsPath, clipBoardDataType,
  collectionsTypename,
} from '../../settings';

interface IProps {
  client: {
    query: ({}) => {};
    writeQuery: ({}) => {};
  };
  history: {
    push: ({}) => {},
    location: {
      pathname: string,
    },
  };
}

interface ResponseObject {
  data: {
    searchResults: {
      results: object[],
    };
  };
}

interface EventObject {
  which: number;
  target: {
    name: any,
    value: any,
  };
  clipboardData: {
    getData(): any,
  };
  preventDefault(): any;
}

interface IState {
  value: string;
  toggleCloseIcon: boolean;
  runningSearch: boolean;
  [key: string]: any;
}

class Search extends Component<IProps, IState> {
  public state = {
    value: '',
    toggleCloseIcon: false,
    runningSearch: false,
  };

  public debounceSearch = debounce((value: string) => {
    const { client } = this.props;
    if (value.trim().length > 1) {
      this.setState({ runningSearch: true });

      runNetworkQuery(client, searchQuery, value)
      .then((response: any) => {
          const { searchResults } = response.data;
          this.writeQueryToCache(searchResults.results);
          this.setState({ runningSearch: false });
        }).catch((error: any) => error);
    }
  }, 1000);

  public componentDidMount() {
    this.setInputFromQuery();
  }

  public setInputFromQuery() {
    const query = queryString.parse(window.location.search);
    if (Object.keys(query)[0] && Object.keys(query)[0] === searchPath) {
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

  public onInputChange = (event: any) => {
    event.preventDefault();
    const { name, value } = event.target;
    const { history } = this.props;
    if (value.trim().length === 1) {
      history.push({
        ...history.location,
        pathname: collectionsPath,
      });
    }

    this.setState({ [name]: value }, () => {
      const { value: searchQueryData } = this.state;

      if (searchQueryData.trim().length) {
        this.setState({ toggleCloseIcon: true });
      } else {
        this.setState({ toggleCloseIcon: false });
      }

      setQuery({ search: searchQueryData });
      this.debounceSearch(searchQueryData);
    });

    if (value.trim().length === 0) { return this.clearSearchQuery(); }
  }

  public clearSearchQuery = () => {
    const { history, client } = this.props;

    this.setState({ value: '', toggleCloseIcon: false });
    setQuery({ search: '' });

    history.push(localStorage.previousLocation);
    localStorage.removeItem(previousLocation);

    runNetworkQuery(client, objectsQuery, '');
    this.setState({ runningSearch: false });
  }

  public handleInputFocus = () => {
    const { history: { location } } = this.props;
    if (location.pathname !== collectionsPath) {
      localStorage.setItem(previousLocation, location.pathname);
    }
  }

  public handleReset = () => {
    const { history } = this.props;
    const { value } = this.state;
    if (!value.trim()) {
      setQuery({ search: null });

      history.push(localStorage.previousLocation);

      return localStorage.removeItem(previousLocation);
    }
  }

  public handleDataPaste = (event: any) => {
    const { clipboardData } = event;
    const { history } = this.props;
    const query: any = clipboardData.getData(clipBoardDataType);
    if (query.trim().length) {
      history.push({
        ...history.location,
        pathname: collectionsPath,
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
          __typename: collectionsTypename,
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

  public render() {
    const { value, toggleCloseIcon, runningSearch } = this.state;
    return (
      <form
        onKeyPress={this.disableSearchOnEnter}
      >
        <input
          className='search'
          type='search'
          placeholder='Search by title, century, culture, department, culture...'
          aria-label='Search'
          name='value'
          id='searchBox'
          onChange={this.onInputChange}
          onFocus={this.handleInputFocus}
          onBlur={this.handleReset}
          autoComplete='off'
          onPaste={this.handleDataPaste}
          value={value}
        />
        {toggleCloseIcon && (
          <button
            type='button'
            onClick={this.clearSearchQuery}
            className='close-icon'
          >
            &times;
          </button>
        )}
        {
          runningSearch && (
            <Spinner disableTip={true} size={25} />
          )
        }
      </form>
    );
  }
}

export default withRouter(compose(
  withApollo,
)(Search));
