import React, { Component, Fragment } from 'react';
import { Query, withApollo } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import queryString from 'querystring';

import './collections.scss';

import BackToTop from '../BackToTop';
import ImageCard from '../ImageCard';
import SkeletonScreen from '../Preloader/SkeletonScreen';
import Spinner from '../Preloader/Spinner';

import { objectsQuery } from './query';
import noImage from '../../assets/no-image-icon.jpg';
import searchQuery from '../Search/query';
import {
  SEARCH_PATH, COLLECTIONS_TYPENAME, READ_QUERY_ERROR,
} from '../../settings';

import {
  ICollectionsProps, CollectionImages, FetchMore,
  CollectionsFetchMoreResult, CollectionsFetchMore,
} from '../../../types';

let page = 1;
let from = 25;

class Collections extends Component<ICollectionsProps> {
  public state = {
    loadingIndicator: false,
    searchResultCount: 0,
    activeSearchData: '',
  };

  public setInputFromQuery() {
    const query = queryString.parse(window.location.search);
    const hasSearchProperty = Object.keys(query).includes(SEARCH_PATH);

    const queryValue = query[SEARCH_PATH];

    if (!hasSearchProperty) {
      return;
    }

    return queryValue;
  }

  public handleFetchMore = (fetchMore: (arg0: FetchMore) => void) => () => {
    const activeSearchData = this.setInputFromQuery();
    this.setState({ loadingIndicator: true, activeSearchData });
    let newData = [];

    fetchMore({
      query: activeSearchData ? searchQuery : objectsQuery,
      variables: {
        size: 24,
        page,
        from,
        search: activeSearchData,
      },
      updateQuery: (prev: any, { fetchMoreResult }: CollectionsFetchMore) => {
        const {
          objects: { records },
          searchResults: { results = [] },
        } = fetchMoreResult as CollectionsFetchMoreResult;

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

        return {
          ...prev,
          objects: {
            records: [...prev.objects.records,
            ...newData],
            __typename: COLLECTIONS_TYPENAME,
          },
        };
      },
    });
  }

  public readQueryFromCache() {
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
      return READ_QUERY_ERROR;
    }
  }

  public loadMoreButton() {
    const records = this.readQueryFromCache();
    const { activeSearchData, searchResultCount } = this.state;
    const lengthOfSearchResult = activeSearchData && searchResultCount >= 24;
    let loadMoreButton;

    if (records.length >= 24) {
      loadMoreButton = (
        <Fragment>
          <Button size='large'>Load More</Button>
        </Fragment>
      );
    }

    if (activeSearchData && !lengthOfSearchResult) {
      loadMoreButton = null;
    }

    return loadMoreButton;
  }

  public noResulFoundError() {
    const records = this.readQueryFromCache();

    if (records.length < 1) {
      return (
        <div className='collections-empty'>
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

  public renderImages(data: CollectionImages[]) {
    const mappedImages = data.map((element) => {
      const { id, primaryimageurl } = element;

      if (!primaryimageurl) {
        element.primaryimageurl = noImage;
      }

      return (
        <Link to={`/collections/${id}`} key={id}>
          <div className='collections-photo__unit'>
            <ImageCard imageData={element} />
          </div>
        </Link>
      );
    })

    return (
      <Fragment>
        {mappedImages}
      </Fragment>
    );
  }

  public renderRetrievedData = (
    loading: boolean, error: any, records: CollectionImages[], fetchMore: any,
  ) => {
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
          <section className='collections-photo'>
            {this.renderImages(records)}
          </section>
          <span
            role='button'
            className='collections-loader'
            onClick={this.handleFetchMore(fetchMore)}
            tabIndex={0}
          >
            {this.renderLoadMoreOrSpinner()}
          </span>
        </Fragment>
      );
    }
  }

  public renderLoadMoreOrSpinner = () => {
    const { loadingIndicator } = this.state;

    if (!loadingIndicator) {
      return this.loadMoreButton();
    }

    return <Spinner />;
  }

  public incrementPage = () => {
    page += 1;
  }

  public render() {
    return (
      <Query
        query={objectsQuery}
        variables={{ size: 24, page: 1 }}
        onCompleted={this.incrementPage}
      >
        {({
          fetchMore, loading, error, data: { objects: { records } = {} as any } = {},
        }) => {
          return (
            <Fragment>
              <div className='collections'>
                <h1 className='collections-header'>Collections</h1>
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

export default withApollo(Collections);
