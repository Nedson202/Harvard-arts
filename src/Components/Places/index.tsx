import React, { Fragment, PureComponent } from 'react';

import GoogleMapReact from 'google-map-react';
import { Query } from 'react-apollo';

import PlaceIds from './PlaceIds';
import Pointer from './Pointer';

import './places.scss';
import { placesQuery } from './query';

import { IPlacesProps } from '../../../types';
import {
  CACHE_FIRST, DEFAULT_PLACE_PROPS, GOOGLE_MAPS_KEY,
} from '../../settings';


class MapContainer extends PureComponent<IPlacesProps> {
  public static defaultProps = DEFAULT_PLACE_PROPS;

  public state = {
    defaultCenter: {},
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

    return { ...filteredPositons[0] };
  }

  public render() {
    let loadedData: any;

    return (
      <Fragment>
        <PlaceIds />

        <Query
          query={placesQuery}
          variables={{
            placeId: '',
          }}
          fetchPolicy={CACHE_FIRST}
        >
          {({
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
                      center={{ ...defaultCenter.geo }}
                    >
                      {this.renderChildComponent(places)}
                    </GoogleMapReact>
                  </div>
                </Fragment>
              );
            }

            if (error) {
              loadedData = (<h1>Failed to load map data</h1>);
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
