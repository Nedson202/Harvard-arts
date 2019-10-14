import React, { Component, Fragment } from 'react';
import GoogleMapReact from 'google-map-react';
import { Query } from 'react-apollo';
import { Input, Icon, Button } from 'antd';
import Pointer from './Pointer';
import { placesQuery, placesIdQuery } from './query';
import './places.scss';
import { client } from '../../index';
import { defaultPlaceProps, networkOnly, placesTypename, activePlaceElement,
  cacheFirst, GOOGLE_MAPS_KEY} from '../../utils';
import Spinner from '../Preloader/Spinner';

interface IProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  coordinates: any[];
}

interface PlaceIDObject {
  parentPlaceID: number;
  pathForward: string;
}

const size = 25;
let from = 0;

class MapContainer extends Component<IProps> {
  public static defaultProps = defaultPlaceProps;

  public state = {
    defaultCenter: {},
    placesSearchData: [],
    retrievedSearch: [],
    placeSearchActive: false,
    placeSearchQuery: '',
    loadingIndicator: false,
  };

  public renderChildComponent = (places: any) => {
    return (
      places.map((coordinate: any, index: number) => {
        if (coordinate.geo) {
          coordinate.geo.lng = coordinate.geo.lon;
          return (
            <Pointer
              key={index}
              {...coordinate.geo}
              text={coordinate.name}
            />
          );
        }
      })
    );
  }

  public getDefaultCenter = (places: any) => {
    const filteredPositons = places.filter((coordinate: any) => {
      if (coordinate.geo) {
        coordinate.geo.lng = coordinate.geo.lon;
        return coordinate;
      }
    });
    return {...filteredPositons[0]};
  }

  public getLocationData = (parentPlaceID: number) => () => {
    client.query({
      query: placesQuery,
      variables: {
        placeId: parentPlaceID,
      },
      fetchPolicy: networkOnly,
    }).then((resp: any) => {
      const { data: { placesData: { places = [] } = {} } = {} } = resp;
      client.writeQuery({
        query: placesQuery,
        data: {
          placesData: {
            places,
            __typename: placesTypename,
          },
        },
        variables: {
          placeId: '',
        },
      });
    });

    const currentlyActive = document.querySelector(`.${activePlaceElement}`);
    if (currentlyActive) {
      currentlyActive.classList.remove(activePlaceElement);
    }
    const htmlPlaceElement = document.querySelector(`p[data-place="${parentPlaceID}"]`);
    if (htmlPlaceElement) {
      htmlPlaceElement.classList.add(activePlaceElement);
    }
  }

  public renderPlaceIds = (places: any) => {
    if (!places.length) {
      return (<h3>No match was found</h3>);
    }
    return (
      places.map((place: PlaceIDObject) => {
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
        return {...prev,
          placesIdData: {
            places: [...prev.placesIdData.places,
              ...places],
            __typename: placesTypename,
          }};
      },
    });
  }

  public render() {
    let loadedData: any;
    const { placeSearchQuery } = this.state;
    return (
      <Fragment>
        <div className='sidenav'>
          <Input
            placeholder='input search text'
            onChange={this.handlePlaceIdSearch}
            onFocus={this.retrievePlaces}
            style={{ width: 230 }}
            value={placeSearchQuery}
          />
          <span
            className='close-icon'
            onClick={this.handleClearPlaceSearch}
          >
            <Icon type='close' />
          </span>
          <Query
            query={placesIdQuery}
            // tslint:disable-next-line:jsx-no-multiline-js
            variables={{
              from: 0,
              size,
            }}
          >
            {({
            // tslint:disable-next-line:jsx-no-multiline-js
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

              return (
                <Fragment>
                  {loadedData}
                  <div
                    className='places-load-more'
                  >
                  {this.renderLoadMoreButton(fetchMore)}
                  </div>
                </Fragment>
              );
            }}
          </Query>
        </div>
        <Query
          query={placesQuery}
          // tslint:disable-next-line:jsx-no-multiline-js
          variables={{
            placeId: '',
          }}
          fetchPolicy={cacheFirst}
        >
          {({
          // tslint:disable-next-line:jsx-no-multiline-js
            loading, error,
            data: { placesData: { places = [] } = {} } = {},
          }) => {
            if (loading) {
              loadedData = (<div>...loading</div>);
            }

            const defaultCenter = this.getDefaultCenter(places);

            if (!loading) {
              loadedData = (
                <Fragment>
                  <div style={{ height: '100vh' }} className='main'>
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: GOOGLE_MAPS_KEY }}
                      defaultZoom={this.props.zoom}
                      center={{...defaultCenter.geo}}
                    >
                      {this.renderChildComponent(places)}
                    </GoogleMapReact>
                  </div>
                </Fragment>
              );
            }

            if (error) {
              loadedData = (<h1>Sorry an error occurred</h1>);
            }
            return (
              <Fragment>
                {loadedData}
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default MapContainer;