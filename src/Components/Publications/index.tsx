import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import Dragula from 'react-dragula';
import HorizontalTimeline from 'react-horizontal-timeline';

import { Button, Tooltip } from 'antd';

import BackToTop from '../BackToTop';
import SkeletonScreen from '../Preloader/SkeletonScreen';
import Spinner from '../Preloader/Spinner';

import './publications.scss';
import publicationQuery from './query';

import { client } from '../..';
import {
  FetchMore, PeopleInitials, PublicationData, PublicationsFetchMore,
  PublicationsFetchMoreResult, PublicationsQueryResponse,
} from '../../../types';
import {
  DATE_VALUES, NOT_AVAILABLE_MESSAGE, PUBLICATIONS_TYPENAME,
} from '../../settings';

let page: number = 1;

class Publications extends Component {
  public state = {
    loadingIndicator: false,
    value: 0,
    dateYear: '2018',
    paginatedResult: 0,
    paginationActive: false,
  };

  public getPeopleInitials(name: string) {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

  public dragulaDecorator = (componentBackingInstance: any) => {
    if (componentBackingInstance) {
      const options = {};
      Dragula([componentBackingInstance], options);
    }
  }

  public handleIndexClick = async (index: number) => {
    page = 1;

    const year = DATE_VALUES[index];

    this.setState({ value: index, dateYear: year });

    const response: PublicationsQueryResponse = await client.query({
      query: publicationQuery,
      variables: {
        size: 18,
        page,
        year,
      },
    });

    const { publicationData: { publications = [] } = {} } = response.data;

    client.writeQuery({
      query: publicationQuery,
      data: {
        publicationData: {
          publications,
          __typename: PUBLICATIONS_TYPENAME,
        },
      },
      variables: { size: 18, page: 1, year },
    });

    page += 1;
  }

  public handleInfiniteScroll = (fetchMore: (arg0: FetchMore) => void, year: number) => () => {
    this.setState({ loadingIndicator: true });

    fetchMore({
      query: publicationQuery,
      variables: {
        size: 18,
        page,
        year,
      },
      updateQuery: (prev: any, { fetchMoreResult }: PublicationsFetchMore) => {
        const {
          publicationData: { publications },
        } = fetchMoreResult as PublicationsFetchMoreResult;

        if (!fetchMoreResult) {
          return prev;
        }

        page = page + 1;
        this.setState({
          loadingIndicator: false,
          paginatedResult: publications.length,
          paginationActive: true,
        });

        return {
          ...prev,
          publicationData: {
            publications: [...prev.publicationData.publications,
            ...publications],
            __typename: PUBLICATIONS_TYPENAME,
          },
        };
      },
    });
  }

  public loadMoreButton(resultLength: number, loadingMore: boolean) {
    const { paginatedResult, paginationActive } = this.state;
    const isPaginatedResult = paginatedResult === 0 || paginatedResult < 18;

    if (loadingMore) {
      return <Spinner />;
    }

    if ((paginationActive && !isPaginatedResult) || (!paginationActive && resultLength >= 18)) {
      return (
        <Button size='large'>Load More</Button>
      );
    }
  }

  public renderPeopleInitials(people: PeopleInitials[]) {
    return (
      <Fragment>
        {
          people.map(({ name, personid }) => (
            <Tooltip
              key={personid * Math.random()}
              placement='top'
              title={name}
            >
              <div className='center'>
                {this.getPeopleInitials(name)}
              </div>
            </Tooltip>
          ))}
      </Fragment>
    );
  }

  public renderPublication(publications: PublicationData[]) {
    return (
      <Fragment>
        {
          publications.map((publication) => (
            <div
              className='publications-grid__item'
              key={publication.publicationid}
            >
              <p className='publications-grid__item-header'>
                <strong>
                  {publication.title.replace(/"/g, '')}
                </strong>
              </p>
              <div className='publications-grid__item-body'>
                <p>
                  <strong>Volume.No</strong>
                  {' '}
                  *
                  {' '}
                  {publication.volumenumber || NOT_AVAILABLE_MESSAGE}
                </p>
                <p>
                  <strong>Volume.Title</strong>
                  {' '}
                  *
                  {' '}
                  {publication.volumetitle || NOT_AVAILABLE_MESSAGE}
                </p>
                <p>
                  <strong>Format</strong>
                  {' '}
                  *
                  {' '}
                  {publication.format || NOT_AVAILABLE_MESSAGE}
                </p>
                <p>
                  <strong>Publication.Place</strong>
                  {' '}
                  *
                  {' '}
                  {publication.publicationplace || NOT_AVAILABLE_MESSAGE}
                </p>
              </div>
              <div>
                <p className='center'><strong>People &amp; Bodies</strong></p>
                <div className='publications-grid__item-people'>
                  {this.renderPeopleInitials(publication.people || [])}
                </div>
              </div>
              {
                publication.description && (
                  <div className='publications-grid__item-more'>
                    <Button size='large'>Learn More</Button>
                  </div>
                )
              }
            </div>
          ))
        }
      </Fragment>
    );
  }

  public incrementPage = () => {
    page += 1;
  }

  public render() {
    const { value, dateYear, loadingIndicator } = this.state;
    let loadedTimelineData: any;
    const parsedNumber = Number(dateYear);

    return (
      <Query
        query={publicationQuery}
        variables={{
          page: 1,
          year: parsedNumber,
          size: 18,
        }}
        onCompleted={this.incrementPage}
      >
        {({
          loading, fetchMore, error,
          data: { publicationData: { publications = [] } = {} } = {},
        }) => {
          if (loading) {
            loadedTimelineData = (
              <div>
                <SkeletonScreen />
              </div>
            );
          }

          if (!loading) {
            loadedTimelineData = (
              <div
                className='publications-grid container'
                ref={this.dragulaDecorator}
              >
                {this.renderPublication(publications)}
              </div>
            );
          }

          if (error) {
            loadedTimelineData = <h1 className='center'>Sorry an error occurred</h1>;
          }

          return (
            <Fragment>
              <div className='publications'>
                <h1>Publications</h1>
                <div
                  style={{
                    width: '100%',
                    height: '100px',
                    margin: '0 auto',
                  }}
                >
                  <HorizontalTimeline
                    index={value}
                    indexClick={this.handleIndexClick}
                    values={DATE_VALUES}
                    styles={{
                      background: '#f8f8f8',
                      foreground: '#005C97',
                      outline: '#dfdfdf',
                    }}
                  />
                </div>
                {loadedTimelineData}
                <span
                  className='collections-loader'
                  tabIndex={0}
                  role='button'
                  onClick={this.handleInfiniteScroll(fetchMore, parsedNumber)}
                >
                  {this.loadMoreButton(publications.length, loadingIndicator)}
                </span>
              </div>
              <BackToTop />
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export default Publications;
