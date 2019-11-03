import React, { Fragment, PureComponent } from 'react';
import { Query } from 'react-apollo';

import { Button, Icon, Input } from 'antd';

import Spinner from '../Preloader/Spinner';

import { client } from '../../index';
import { placesIdQuery, placesQuery } from './query';

import { IPlaceIDObject, IPlacesProps } from '../../../types';
import {
  ACTIVE_PLACE_ELEMENT, DEFAULT_PLACE_PROPS, NETWORK_ONLY, PLACES_TYPENAME,
} from '../../settings';


const size = 25;
let from = 0;

class PlaceIds extends PureComponent<IPlacesProps> {
  public static defaultProps = DEFAULT_PLACE_PROPS;

  public state = {
    defaultCenter: {},
    placesSearchData: [],
    retrievedSearch: [],
    placeSearchActive: false,
    placeSearchQuery: '',
    loadingIndicator: false,
  };

  public getLocationData = (parentPlaceID: number) => () => {
    client.query({
      query: placesQuery,
      variables: {
        placeId: parentPlaceID,
      },
      fetchPolicy: NETWORK_ONLY,
    }).then((resp: any) => {
      const { data: { placesData: { places = [] } = {} } = {} } = resp;
      client.writeQuery({
        query: placesQuery,
        data: {
          placesData: {
            places,
            __typename: PLACES_TYPENAME,
          },
        },
        variables: {
          placeId: '',
        },
      });
    });

    const currentlyActive = document.querySelector(`.${ACTIVE_PLACE_ELEMENT}`);
    const htmlPlaceElement = document.querySelector(`p[data-place="${parentPlaceID}"]`);

    if (currentlyActive) {
      currentlyActive.classList.remove(ACTIVE_PLACE_ELEMENT);
    }

    if (htmlPlaceElement) {
      htmlPlaceElement.classList.add(ACTIVE_PLACE_ELEMENT);
    }
  }

  public renderPlaceIds = (places: any) => {
    if (!places.length) {
      return (
        <h3 className='center'>No match was found</h3>
      );
    }

    return (
      places
        .map((place: IPlaceIDObject) => {
          const { parentPlaceID, pathForward } = place;

          return (
            <p
              key={parentPlaceID}
              onClick={this.getLocationData(parentPlaceID)}
              data-place={parentPlaceID}
            >{pathForward}
            </p>
          );
        })
    );
  }

  public retrievePlaces = () => {
    const queryResult: any = client.readQuery({
      query: placesIdQuery,
      variables: {
        from: 0,
        size,
      },
    });

    const { placesIdData: { places = [] } = {} } = queryResult;

    this.setState({ retrievedSearch: places });
  }

  public handlePlaceIdSearch = (event: any) => {
    const { value } = event.target;
    const { retrievedSearch } = this.state;
    const filteredData = retrievedSearch.filter((place: any) => {
      if (place.pathForward.toLowerCase().includes(value.toLowerCase())) {
        return true;
      }
    });

    this.setState({
      placesSearchData: filteredData,
      placeSearchActive: true,
      placeSearchQuery: value,
    });
  }

  public handleClearPlaceSearch = () => {
    this.setState({
      placesSearchData: [],
      placeSearchActive: false,
      placeSearchQuery: '',
    });
  }

  public renderLoadMoreButton = (fetchMore: any) => {
    const { loadingIndicator } = this.state;

    if (!loadingIndicator) {
      return (
        <Button
          size='large'
          onClick={this.handleFetchMore(fetchMore)}
        >
          Load More
        </Button>
      );
    }

    return <Spinner />;
  }

  public handleFetchMore = (fetchMore: any) => () => {
    this.setState({ loadingIndicator: true });
    from = from + size + 1;

    fetchMore({
      query: placesIdQuery,
      variables: {
        size,
        from,
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        const {
          placesIdData: { places = [] } = {},
        } = fetchMoreResult;

        if (!fetchMoreResult) {
          return prev;
        }

        this.setState({
          loadingIndicator: false,
        });

        return {
          ...prev,
          placesIdData: {
            places: [...prev.placesIdData.places,
            ...places],
            __typename: PLACES_TYPENAME,
          },
        };
      },
    });
  }

  public render() {
    let loadedData: any;
    const { placeSearchQuery } = this.state;

    return (
      <Fragment>
        <div className='places-sidenav'>
          <Input
            placeholder='input search text'
            onChange={this.handlePlaceIdSearch}
            onFocus={this.retrievePlaces}
            value={placeSearchQuery}
          />
          {placeSearchQuery && <span
            className='close-icon'
            onClick={this.handleClearPlaceSearch}
          >
            <Icon type='close' />
          </span>
          }

          <Query
            query={placesIdQuery}
            variables={{
              from: 0,
              size,
            }}
          >
            {({
              loading, error, fetchMore,
              data: { placesIdData: { places = [] } = {} } = {},
            }) => {
              const { placesSearchData, placeSearchActive } = this.state;
              let dataToRender = places;

              if (placeSearchActive) {
                dataToRender = placesSearchData;
              }

              if (loading) {
                loadedData = (<div>...loading</div>);
              }

              if (!loading) {
                loadedData = (
                  <Fragment>
                    {this.renderPlaceIds(dataToRender)}
                  </Fragment>
                );
              }

              if (error) {
                loadedData = (<h1>Sorry an error occurred</h1>);
              }

              const placeIdsHasProperty: boolean = dataToRender.length > 0;

              return (
                <Fragment>
                  {loadedData}
                  <div
                    className='places-load-more'
                  >
                    {placeIdsHasProperty && this.renderLoadMoreButton(fetchMore)}
                  </div>
                </Fragment>
              );
            }}
          </Query>
        </div>
      </Fragment>
    );
  }
}

export default PlaceIds;
