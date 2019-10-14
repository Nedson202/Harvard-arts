import gql from 'graphql-tag';

export const placesQuery = gql`
  query placesData($size: Int! $page: Int!) {
    placesData(placeId: $placeId) @rest(type: "Places", path: "places?placeId={args.placeId}") {
      places
    }
  }
`;

export const placesIdQuery = gql`
  query placesIdData($size: Int! $from: Int!) {
    placesIdData(size: $size, from: $from)
    @rest(type: "PlaceIDs", path: "places/id?size={args.size}&from={args.from}") {
      places
    }
  }
`;
