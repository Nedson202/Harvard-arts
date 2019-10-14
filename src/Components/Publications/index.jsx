import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { Tooltip, Button } from 'antd';
import Dragula from 'react-dragula';
// import PropTypes from 'prop-types';
import HorizontalTimeline from 'react-horizontal-timeline';

import SkeletonScreen from '../Preloader/SkeletonScreen';
import Spinner from '../Preloader/Spinner';
import BackToTop from '../BackToTop';

import './publications.scss';
import publicationQuery from './query';
import { dateValues, publicationsTypename, notAvailableText } from '../../settings';

let page;

class Publications extends Component {
  state = {
    loadingIndicator: false,
    value: 0,
    dateYear: '1999',
    paginatedResult: 0,
    paginationActive: false,
  }

  getPeopleInitials(name) {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }

  dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      const options = { };
      Dragula([componentBackingInstance], options);
    }
  };

  handleIndexClick = (index) => {
    this.setState({ value: index, dateYear: dateValues[index] });
  };

  handleInfiniteScroll = (fetchMore, year) => () => {
    this.setState({ loadingIndicator: true });
    fetchMore({
      query: publicationQuery,
      variables: {
        size: 24,
        page: page,
        year,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        const {
          publicationData: { publications } = {},
        } = fetchMoreResult;

        if (!fetchMoreResult) return prev;

        page = page + 1;
        this.setState({
          loadingIndicator: false,
          paginatedResult: publications.length,
          paginationActive: true,
        });

        return Object.assign({}, prev, {
          publicationData: {
            publications: [...prev.publicationData.publications,
              ...publications],
            __typename: publicationsTypename
          },
        });
      },
    });
  }

  loadMoreButton(reultLength) {
    let loadMoreButton;
    const { paginatedResult, paginationActive } = this.state;
    const isPaginatedResult = paginatedResult === 0 || paginatedResult < 18;

    if (!paginationActive && reultLength >= 18) {
      loadMoreButton = (
        <Fragment>
          <Button size="large">Load More</Button>
        </Fragment>
      );
    } else if (paginationActive && !isPaginatedResult) {
      console.log(isPaginatedResult);
      loadMoreButton = (
        <Fragment>
          <Button size="large">Load More</Button>
        </Fragment>
      );
    } else {
      loadMoreButton = <h3>No more result to show</h3>;
    }
  
    return loadMoreButton;
  }

  renderPeopleInitials(people) {
    return (
      <Fragment>
        {
          people.map(element => (
            <Tooltip
              key={element.personid * Math.random()}
              placement="top"
              title={element.name}
            >
              <div className="center">
                {this.getPeopleInitials(element.name)}
              </div>
            </Tooltip>
          ))
        }
      </Fragment>
    );
  }

  renderPublication(publications) {
    return (
      <Fragment>
        {
          publications.map(publication => (
            <div
              className="publications-grid__item"
              key={publication.publicationid}
            >
              <p className="publications-grid__item-header">
                <strong>
                  {publication.title}
                </strong>
              </p>
              <div className="publications-grid__item-body">
                <p>
                  <strong>Volume.No</strong>
                  {' '}
                  *
                  {' '}
                  {publication.volumenumber || notAvailableText}
                </p>
                <p>
                  <strong>Volume.Title</strong>
                  {' '}
                  *
                  {' '}
                  {publication.volumetitle || notAvailableText}
                </p>
                <p>
                  <strong>Format</strong>
                  {' '}
                  *
                  {' '}
                  {publication.format || notAvailableText}
                </p>
                <p>
                  <strong>Publication.Place</strong>
                  {' '}
                  *
                  {' '}
                  {publication.publicationplace || notAvailableText}
                </p>
              </div>
              <div>
                <p><strong>People & Bodies</strong></p>
                <div className="publications-grid__item-people">
                  {this.renderPeopleInitials(publication.people || [])}
                </div>
              </div>
              {
                publication.description && (
                <div className="publications-grid__item-more">
                  <Button size="large">Learn More</Button>
                </div>
                )
              }
            </div>
          ))
        }
      </Fragment>
    );
  }

  render() {
    const { value, dateYear, loadingIndicator } = this.state;
    let loadedTimelineData;
    const parsedNumber = Number(dateYear);
    return (
      <Query
        query={publicationQuery}
        variables={{
          page: 1,
          year: parsedNumber,
          size: 18
        }}
        onCompleted={() => {
          page = page + 1;
        }}
      >
        {({
          loading, fetchMore, error,
          data: { publicationData: { publications = [] } = {} } = {}
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
                className="publications-grid container"
                ref={this.dragulaDecorator}
              >
                {this.renderPublication(publications)}
              </div>
            );
          }

          if (error) {
            loadedTimelineData = (
              <Fragment>
                <h1>Sorry an error occurred</h1>
              </Fragment>
            );
          }

          return (
            <Fragment>
              <div className="publications">
                <h1>Publications</h1>
                <div style={{
                  width: '100%', height: '100px', margin: '0 auto'
                }}
                >
                  <HorizontalTimeline
                    index={value}
                    indexClick={this.handleIndexClick}
                    values={dateValues}
                    styles={{
                      background: '#f8f8f8',
                      foreground: '#005C97',
                      outline: '#dfdfdf',
                    }}
                  />
                </div>
                {loadedTimelineData}
                <span
                  className="collections-loader"
                  tabIndex={0}
                  role="button"
                  onClick={this.handleInfiniteScroll(fetchMore, parsedNumber)}
                >
                  {!loadingIndicator && this.loadMoreButton(publications.length)}
                  {loadingIndicator && <Spinner />}
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

Publications.propTypes = {
};

export default Publications;
