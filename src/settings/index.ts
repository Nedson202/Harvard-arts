import dotenv from 'dotenv';

dotenv.config();

// Search

export const searchPath = '?search';
export const previousLocation = 'previousLocation';
export const collectionsPath = '/collections';
export const clipBoardDataType = 'text/plain';
export const searchBoxBorderStyle = '1px solid #005C97';
export const searchBoxElement = 'searchBox';
export const collectionsTypename = 'Object';

// Publications
export const dateValues = [
  '1999', '2000', '2001', '2002', '2003',
  '2013', '2014', '2015', '2016', '2017', '2018',
];
export const publicationsTypename = 'Publications';
export const publicationPage = 1;

export const notAvailableText = 'Not Available';

// Navbar
export const rootPath = '/';
export const navBarElement = 'nav-bar';
export const customNavElement = 'custom-nav';
export const noDisplay = 'none';
export const navBarBoxShadow = 'rgba(0, 0, 0, 0.1) 0px 5px 15px, rgba(0, 0, 0, 0.1) 0px 4px 30px';
export const minimumScrollDistance = 20;
export const maximumScrollDistance = 25;

// Places
export const placesPath = '/places';
export const defaultPlaceProps = {
  center: {
    lat: 59.95,
    lng: 30.33,
  },
  coordinates: [
    {
      lat: 59.95,
      lng: 30.33,
      text: 'world',
    },
    {
      lat: 59.724465,
      lng: 30.080121,
      text: 'arang',
    },
  ],
  zoom: 7,
};
export const networkOnly = 'network-only';
export const cacheFirst = 'cache-first';
export const placesTypename = 'Places';
export const activePlaceElement = 'activePlace';
export const horizontalScrollDistance = 100;
export const imageToggleCount = 1;

export const readQueryError = 'Unable to run query on cache';

// Collection
export const fieldsNeeded = ['publications', 'exhibitions', 'century', 'classification',
'contextualtext', 'department', 'copyright', 'details', 'provenance', 'accessionyear',
'accessionmethod', 'title', 'creditline', 'culture', 'medium', 'primaryimageurl'];
export const backgroundOverlay = 'rgba(0,0,0,0.6)';
export const cancelBackgroundOverlay = 'rgba(0,0,0,0.0)';
export const antIcomColor = 'rgba(0,0,0,.25)';
export const whiteBackground = '#fff';
export const formElement = 'form';

export const GOOGLE_MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY || '';
