import { DijkstraResult, InsideStationCoordinates, InsideStationImageURL, InsideStationPath, RequestUser, ResponseProfile, Route, StationData, StationInformation, Stationlist } from "@/types/domain";
import apiClient from "./apiClient"

// 로그인 정보 보내기
export const postLogin = async ({ email, password }: RequestUser): Promise<any> => {
  const { data } = await apiClient.post('/members/login', {
    memberEmail: email,
    memberPassword: password,
  });
  return data;
};

// 회원가입 정보 보내기
export const postSignup = async ({ email, password, userName }: RequestUser & { userName: string }): Promise<void> => {
  const { data } = await apiClient.post('/members/signup', {
    memberName: userName,
    memberEmail: email,
    memberPassword: password,
  });
  return data;
};

// 역 검색
export const searchStation = async ({ stationName }: StationInformation): Promise<StationData> => {
  const { data } = await apiClient.post("/stations/detail", null, {
    params: {
      stationName: stationName,
    },
  });
  return data;
};

// 로그아웃
export const logout = async () => {
  await apiClient.get('/members/logout');
};

// 프로필 가져오기
export const getProfile = async (): Promise<ResponseProfile> => {
  const { data } = await apiClient.get('/members/profile');
  return data;
};

// 역이 있는지 유무 탐색
export const isStation = async ({ stationName }: StationInformation) => {
  const { data } = await apiClient.post("/stations", null, {
    params: {
      stationName: stationName,
    },
  });
  return data;
};

// 즐겨찾기
export const getFavorite = async (): Promise<Stationlist> => {
  const { data } = await apiClient.get("/favorites");
  return data;
};

// 즐겨찾기 추가
export const addFavorite = async ({stationName}: StationInformation) => {
  const { data } = await apiClient.post("/favorites", null, {
    params: {
      stationName: stationName,
    },
  });
  return data;
};

// 즐겨찾기 삭제
export const delFavorite = async ({ stationName }: StationInformation) => {
  const { data } = await apiClient.delete("/favorites", {
    params: { stationName: stationName }, // 쿼리 파라미터에 데이터 포함
  });
  return data;
};


// 역 리스트 가져오기
export const getStationList = async (): Promise<Stationlist> => {
  const { data } = await apiClient.get("/stations/without-favorites");
  return data;
};

// 경로 보내기
export const postRoute = async ({ departure, arrival, option, waypoints }: Route): Promise<DijkstraResult> => {
  const { data } = await apiClient.post("/routes", {
    departureStation: departure,
    arrivalStation: arrival,
    option: option,
    waypoints: waypoints,
  });
  return data;
};

// 지도 받기 위한 데이터
export const postInsideStationURL = async ({ line, stationName, stationType }: InsideStationPath): Promise<string> => {
  const { data } = await apiClient.post("/route-info/image-path", {
    line: line,
    stationName: stationName,
    stationType: stationType,
  });
  return data;
};

// 좌표를 받기 위한 데이터
export const postCoordsData = async ({ line, stationName, exitNum, stationType }: InsideStationCoordinates): Promise<string> => {
  const { data } = await apiClient.post("/route-info/coordinates", {
    line: line,
    stationName: stationName,
    exitNum: exitNum,
    stationType: stationType,
  });
  return data;
};

