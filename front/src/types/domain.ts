import { colors } from "@/constants/colors";

export type LineColor = 'RED' | 'YELLOW' | 'BROWN' | 'GREEN' | 'LIGHT_GREEN' | 'BLUE' | 'SKY_BLUE' | 'NAVY' | 'PURPLE';

export interface connectedStationsInfo {
  direction: string;
  stationName: string;
  endStation: string;
}

export interface connectedStations {
  line: string;
  connectedStationsInfo: connectedStationsInfo[];
}

export interface StationData {
  stationName: string;
  connectedStations: connectedStations[];
}

export type RequestUser = {
  email: string;
  password: string;
};

export type LineCategory = {
  [key in LineColor]: string;
};

export const LINE_COLORS:LineCategory = {
  RED: colors.LINE_RED,
  YELLOW: colors.LINE_YELLOW,
  BROWN: colors.LINE_BROWN,
  GREEN: colors.LINE_GREEN,
  LIGHT_GREEN: colors.LINE_LIGHT_GREEN,
  BLUE: colors.LINE_BLUE,
  SKY_BLUE: colors.LINE_SKY_BLUE,
  NAVY: colors.LINE_NAVY,
  PURPLE: colors.LINE_PURPLE,
};

export const getLineColor = (line: string): string => {
  const lineMapping: { [key: string]: LineColor } = {
    '1': 'GREEN',
    '2': 'NAVY',
    '3': 'BROWN',
    '4': 'RED',
    '5': 'BLUE',
    '6': 'YELLOW',
    '7': 'LIGHT_GREEN',
    '8': 'SKY_BLUE',
    '9': 'PURPLE',
  };
  const lineColor = lineMapping[line];
  return lineColor ? LINE_COLORS[lineColor] : colors.BLACK;
};


export type ResponseProfile = Profile;

export interface Profile {
  memberName: string,
  memberEmail: string,
  memberImage: string | null;
}

export type StationInformation = {
  stationName: string;
};

export type Stationlist = StationInformation[];

export type Route = {
  departure: string;
  arrival: string;
  option: '최단시간' | '최소환승' | '최저요금' | '최단거리';
  waypoints?: string[];
};

export type RouteResult = {
  line: string;
  path: string[];
  timeValue: number;
};

export type ValueResults = {
  time: number;
  distance: number;
  cost: number;
  transfer: number;
};

export type DijkstraResult = {
  routeResults: RouteResult[];
  valueResults: ValueResults;
};

export type InsideStationPath = {
  line: string;
  stationName: string;
  stationType: 'departure' | 'transfer' | 'arrival';
};

export type InsideStationImageURL = {
  imageURL: string | null;
};

export type InsideStationCoordinates = {
  line: string;
  stationName: string;
  connectedStation: string;
  exitNum: string;
  stationType: 'departure' | 'transfer' | 'arrival';
};

export type CoordsData = {
  coords: string;
};
