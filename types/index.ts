import { WithApolloClient } from 'react-apollo';

export interface IBackToTopState {
  displayBackToTop: boolean;
}

export interface IPlacesProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  coordinates: any[];
}

export interface IPlaceIDObject {
  parentPlaceID: number;
  pathForward: string;
}

export interface ISearchProps {
  client: {
    query: ({ }) => {};
    writeQuery: ({ }) => {};
  };
  history: {
    push: ({ }) => {},
    location: {
      pathname: string,
    },
  };
}

export interface ISearchState {
  value: string;
  toggleCloseIcon: boolean;
  runningSearch: boolean;
  [key: string]: any;
}

export interface EventObject {
  which?: number;
  target: {
    name: any,
    value: any,
  };
  clipboardData?: {
    getData(): any,
  };
  preventDefault(): any;
}

export interface ResponseObject {
  data: {
    searchResults: {
      results: object[],
    };
  };
}

export interface ClientObject {
  query: ({ }) => {};
  readQuery?: ({ }) => any;
}

export interface ISpinnerProps {
  disableTip?: boolean;
  size?: number;
}

export interface IImageCardProps {
  imageData: {
    primaryimageurl: string;
    title?: string;
  };
}

export interface CollectionsProps {
  query: ({ }) => {};
  readQuery: ({ }) => any;
}

export interface CollectionProps {
  match: {
    params: {
      id: number;
    };
  };
}

export type ICollectionsProps = WithApolloClient<CollectionsProps>;

export interface CollectionImages {
  id: string;
  primaryimageurl: string;
}

export interface FetchMore {
  query: ({ }) => {};
  variables: object;
  updateQuery: any;
}

export interface CollectionsFetchMore {
  fetchMoreResult: object;
}

export interface CollectionsFetchMoreResult {
  objects: {
    records: object[];
  };
  searchResults: {
    results: object[];
  };
}

export interface ScrollEvent {
  type: string;
  listener: (event: Event) => void;
  options?: { capture?: boolean, passive?: boolean };
}

export interface CollectionDetail {
  id: string;
  text: string;
}

export interface ContextualText {
  context: string;
  text: string;
}

export interface ObjectInterface {
  [key: string]: any;
}

export interface FullImageViewValue {
  primaryimageurl: string;
}

export interface CollectionGroupValue {
  title?: string;
  primaryimageurl?: string;
  accessionmethod?: string;
  accessionyear?: number;
  century?: number;
  classification?: string;
  contextualtext?: ContextualText[];
  [key: string]: any;
}

export interface PeopleInitials {
  personid: number;
  name: string;
}

export interface PublicationData {
  title: string;
  publicationid: number;
  volumenumber: number;
  volumetitle: string;
  format: string;
  publicationplace: string;
  description: string;
  people: PeopleInitials[];
}

export interface PublicationsFetchMore {
  fetchMoreResult: object;
}

export interface PublicationsFetchMoreResult {
  publicationData: {
    publications: object[];
  };
}

export interface INavbarState {
  isSideNavOpen: boolean;
}

export interface IPointerProps {
  text: string;
}
