import dotenv from 'dotenv';

dotenv.config();

// Search
export const SEARCH_PATH = '?search';
export const PREVIOUS_LOCATION = 'PREVIOUS_LOCATION';
export const COLLECTIONS_PATH = '/collections';
export const CLIP_BOARD_DATA_TYPE = 'text/plain';
export const COLLECTIONS_TYPENAME = 'Object';

// Publications
export const DATE_VALUES = [
  '1999', '2000', '2001', '2002', '2003',
  '2013', '2014', '2015', '2016', '2017', '2018',
];
export const PUBLICATIONS_TYPENAME = 'Publications';

export const NOT_AVAILABLE_MESSAGE = 'Not Available';

// Navbar
export const ROOT_PATH = '/';
export const NAV_BAR_ELEMENT = 'nav-bar';
export const CUSTOM_NAV_ELEMENT = 'custom-nav';
export const NO_DISPLAY = 'none';
export const NAV_BAR_BOX_SHADOW = 'rgba(0, 0, 0, 0.1) 0px 5px 15px, rgba(0, 0, 0, 0.1) 0px 4px 30px';
export const MINIMUM_SCROLL_DISTANCE = 20;
export const MAXIMUM_SCROLL_DISTANCE = 25;

// Places
export const PLACES_PATH = '/places';
export const DEFAULT_PLACE_PROPS = {
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
export const NETWORK_ONLY = 'network-only';
export const CACHE_FIRST = 'cache-first';

export const PLACES_TYPENAME = 'Places';
export const ACTIVE_PLACE_ELEMENT = 'activePlace';
export const HORIZONTAL_SCROLL_DISTANCE = 100;
export const IMAGE_TOGGLE_COUNT = 1;

export const READ_QUERY_ERROR = 'Unable to run query on cache';

// Collection
export const FIELDS_NEEDED = [
  'publications', 'exhibitions', 'century', 'classification',
  'contextualtext', 'department', 'copyright', 'details', 'provenance',
  'accessionyear', 'accessionmethod', 'title', 'creditline', 'culture',
  'medium', 'primaryimageurl',
];
export const BACKGROUND_OVERLAY = 'rgba(0,0,0,0.6)';
export const CANCEL_BACKGROUND_OVERLAY = 'rgba(0,0,0,0.0)';
export const ANT_ICON_COLOR = 'rgba(0,0,0,.25)';
export const WHITE_BACKGROUND = '#fff';
export const FORM_ELEMENT = 'form';

export const GOOGLE_MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY || '';

export const SCROLL = 'scroll';
export const MOUSE_DOWN = 'mousedown';
