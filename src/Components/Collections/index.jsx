import React, { Component, Fragment } from 'react';
import { Query, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './collections.scss';
import { Button } from 'antd';
import queryString from 'querystring';
import { objectsQuery } from './query';
import ImageCard from './ImageCard';
import Spinner from '../Preloader/Spinner';
import SkeletonScreen from '../Preloader/SkeletonScreen';
import noImage from '../../assets/no-image-icon.jpg';
import searchQuery from '../Search/query';
import BackToTop from '../BackToTop/BackToTop';
import {
  searchPath, collectionsTypename, readQueryError,
  notAvailableText
} from '../../utils';

let page = 1;
let from = 25;

class Collections extends Component {
  state = {
    loadingIndicator: false,
    searchResultCount: 0,
    activeSearchData: '',
  }

  setInputFromQuery() {
    const query = queryString.parse(window.location.search);
    if (Object.keys(query)[0] && Object.keys(query)[0] === searchPath) {
      const queryValue = Object.values(query)[0];
      if (queryValue.trim().length) return queryValue;
    }
  }

  handleFetchMore = fetchMore => () => {
    const activeSearchData = this.setInputFromQuery();
    this.setState({ loadingIndicator: true, activeSearchData });
    let newData = [];
    fetchMore({
      query: activeSearchData ? searchQuery : objectsQuery,
      variables: {
        size: 24,
        page,
        from,
        search: activeSearchData
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        const {
          objects: { records } = {},
          searchResults: { results = [] } = {}
        } = fetchMoreResult;
        newData = records;
        if (results.length !== 0) {
          newData = results;
        }
        if (activeSearchData) {
          from += 24;
        }
        if (!fetchMoreResult) {
          return prev;
        }
        this.setState({
          loadingIndicator: false,
          searchResultCount: newData.length,
        });
        return Object.assign({}, prev, {
          objects: {
            records: [...prev.objects.records,
            ...newData],
            __typename: collectionsTypename
          },
        });
      },
    });
  }

  readQueryFromCache() {
    const { client } = this.props;
    try {
      const cacheData = client.readQuery({
        query: objectsQuery,
        variables: {
          size: 24,
          page: 1,
        },
      });

      if (cacheData.objects.records) {
        return cacheData.objects.records;
      }
      return [];
    } catch (error) {
      return readQueryError;
    }
  }

  loadMoreButton() {
    const records = this.readQueryFromCache();
    const { activeSearchData, searchResultCount } = this.state;
    const lengthOfSearchResult = activeSearchData && searchResultCount >= 24;
    let loadMoreButton;
    if (records.length >= 24) {
      loadMoreButton = (
        <Fragment>
          <Button size="large">Load More</Button>
        </Fragment>
      );
    }

    if (activeSearchData && !lengthOfSearchResult) {
      loadMoreButton = null;
    }
    return loadMoreButton;
  }

  noResulFoundError() {
    const records = this.readQueryFromCache();
    if (records.length < 1) {
      return (
        <div className="collections-empty">
          <p>No result found</p>
          <ul>
            <li>You can modify your search query</li>
            <li>
              Click the close button on the search field to clear this out
            </li>
            <li>
              Fields you can query are title, century, accessionmethod, period, technique,
              classification, department, culture, medium, verificationleveldescription

            </li>
          </ul>
        </div>
      );
    }
  }

  renderImages(data) {
    return (
      <Fragment>
        {
          data.map((element) => {
            const {
              technique, id, culture, classification, department,
              accessionyear, primaryimageurl,
            } = element;
            const content = (
              <div>
                <p>
                  <b>Technique:</b>
                  {' '}
                  {technique || notAvailableText}
                </p>
                <p>
                  <b>AccessionYear:</b>
                  {' '}
                  {accessionyear || notAvailableText}
                </p>
                <p>
                  <b>Culture:</b>
                  {' '}
                  {culture || notAvailableText}
                </p>
                <p>
                  <b>Classification:</b>
                  {' '}
                  {classification || notAvailableText}
                </p>
                <p>
                  <b>Department:</b>
                  {' '}
                  {department || notAvailableText}
                </p>
              </div>
            );
            if (!primaryimageurl) {
              element.primaryimageurl = noImage;
            }
            return (
              // <Popover key={id} content={content} title={`Century: ${century || notAvailableText}`} placement="left">
              <Link to={`/collections/${id}`}>
                <div className="collections-photo__unit">
                  <ImageCard imageData={element} />
                </div>
              </Link>
              // </Popover>
            );
          })
        }
      </Fragment>
    );
  }

  renderRetrievedData = (loading, error, records, fetchMore) => {
    if (loading) {
      return <SkeletonScreen />;
    }
    if (error) {
      return (
        <Fragment>
          <h1>Sorry an error occurred</h1>
        </Fragment>
      );
    }
    if (!loading && records.length) {
      return (
        <Fragment>
          <section className="collections-photo">
            {this.renderImages(records)}
          </section>
          <span
            role="button"
            className="collections-loader"
            onClick={this.handleFetchMore(fetchMore)}
            tabIndex={0}
          >
            {this.renderLoadMoreOrSpinner()}
          </span>
        </Fragment>
      );
    }
  }

  renderLoadMoreOrSpinner = () => {
    const { loadingIndicator } = this.state;
    if (!loadingIndicator) {
      return this.loadMoreButton();
    }
    return <Spinner />
  }

  render() {
    return (
      <Query
        query={objectsQuery}
        variables={{ size: 24, page: 1 }}
        onCompleted={() => {
          page += 1;
        }}
      >
        {({
          fetchMore, loading, error, data: { objects: { records } = {} } = {}
        }) => {
          return (
            <Fragment>
              <div className="collections">
                <h1 className="collections-header">Collections</h1>
                {this.renderRetrievedData(loading, error, records, fetchMore)}
                {!loading && this.noResulFoundError()}
              </div>
              <BackToTop />
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

Collections.propTypes = {
  client: PropTypes.object.isRequired,
};

export default withApollo(Collections);