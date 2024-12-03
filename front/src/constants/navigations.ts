const mainNavigations = {
  HOME: 'Home',
  BOOK_MARK: 'BookMark',
  STATION: 'Station',
} as const;

const authNavigations = {
  AUTH_HOME: 'AuthHome',
  LOGIN: 'Login',
  SIGNUP: 'Signup',
} as const;

const mapNavigations = {
  MAP_HOME: 'MapHome',
  STATION_SEARCH: 'StationSearch',
  STATION_INFO: 'StationInfo',
  INSIDE_ROUTE: 'InsideRoute',
} as const;

export {mainNavigations, authNavigations, mapNavigations};
