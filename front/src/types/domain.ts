import { colors } from "@/constants/colors";

// 역 호선 색
export type LineColor = 'RED' | 'YELLOW' | 'BROWN' | 'GREEN' | 'LIGHT_GREEN' | 'BLUE' | 'SKY_BLUE' | 'NAVY' | 'PURPLE';

// 연결 역 인터페이스
export interface connectedStationsInfo {
  direction: string;
  stationName: string;
  endStation: string;
}

// 연결 역 정보
export interface connectedStations {
  line: string;
  connectedStationsInfo: connectedStationsInfo[];
}

// 역 정보
export interface StationData {
  stationName: string;
  connectedStations: connectedStations[];
}

// 사용자 정보(로그인)
export type RequestUser = {
  email: string;
  password: string;
};

// 호선 색
export type LineCategory = {
  [key in LineColor]: string;
};

// 호선 색 정의
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

// 색 가져오기
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

// 프로필 정보
export interface Profile {
  memberName: string,
  memberEmail: string,
  memberImage: string | null;
}

// 역 이름
export type StationInformation = {
  stationName: string;
};

export type Stationlist = StationInformation[];

// 경로 받을 때 보낼 정보
export type Route = {
  departure: string;
  arrival: string;
  option: '최단시간' | '최소환승' | '최저요금' | '최단거리';
  waypoints?: string[];
};

// 경로 결과 값
export type RouteResult = {
  line: string; // 노선 번호
  path: string[]; // 경로 (역 ID 배열)
  timeValue: number; // 시간 값 (분 단위)
};

// 종류에 따른 결과 값
export type ValueResults = {
  time: number; // 총 소요 시간 (분 단위)
  distance: number; // 거리 (미터 단위)
  cost: number; // 비용 (원 단위)
  transfer: number; // 환승 횟수
};

// 다익스트라 결과값
export type DijkstraResult = {
  routeResults: RouteResult[]; // 경로 결과 배열
  valueResults: ValueResults; // 부가 정보
};

// 역 내부 경로 받아올 때 보낼 정보
export type InsideStationPath = {
  line: string;
  stationName: string;
  stationType: 'departure' | 'transfer' | 'arrival';
};

// 역 내부 지도 이미지 받아올 주소
export type InsideStationImageURL = {
  imageURL: string;
};

// 역 내부 좌표 받아올 때 보낼 정보
export type InsideStationCoordinates = {
  line: string;
  stationName: string;
  exitNum: string;
  stationType: 'departure' | 'transfer' | 'arrival';
};

// 역 내부 좌표
export type CoordsData = {
  coords: string;
};
