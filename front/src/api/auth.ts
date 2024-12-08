import { DijkstraResult, InsideStationCoordinates, InsideStationPath, RequestUser, ResponseProfile, Route, StationData, StationInformation, Stationlist } from "@/types/domain";
import apiClient from "./apiClient"

export const postLogin = async ({ email, password }: RequestUser): Promise<any> => {
  const { data } = await apiClient.post('/members/login', {
    memberEmail: email,
    memberPassword: password,
  });
  return data;
};

export const postSignup = async ({ email, password, userName }: RequestUser & { userName: string }): Promise<void> => {
  const { data } = await apiClient.post('/members/signup', {
    memberName: userName,
    memberEmail: email,
    memberPassword: password,
  });
  return data;
};

export const searchStation = async ({ stationName }: StationInformation): Promise<StationData> => {
  const { data } = await apiClient.post("/stations/detail", null, {
    params: {
      stationName: stationName,
    },
  });
  return data;
};

export const logout = async () => {
  await apiClient.get('/members/logout');
};

export const getProfile = async (): Promise<ResponseProfile> => {
  const { data } = await apiClient.get('/members/profile');
  return data;
};

export const isStation = async ({ stationName }: StationInformation) => {
  const { data } = await apiClient.post("/stations", null, {
    params: {
      stationName: stationName,
    },
  });
  return data;
};

export const getFavorite = async (): Promise<Stationlist> => {
  const { data } = await apiClient.get("/favorites");
  return data;
};

export const addFavorite = async ({stationName}: StationInformation) => {
  const { data } = await apiClient.post("/favorites", null, {
    params: {
      stationName: stationName,
    },
  });
  return data;
};

export const delFavorite = async ({ stationName }: StationInformation) => {
  const { data } = await apiClient.delete("/favorites", {
    params: { stationName: stationName },
  });
  return data;
};


export const getStationList = async (): Promise<Stationlist> => {
  const { data } = await apiClient.get("/stations/without-favorites");
  return data;
};

export const postRoute = async ({ departure, arrival, option, waypoints }: Route): Promise<DijkstraResult> => {
  const { data } = await apiClient.post("/routes", {
    departureStation: departure,
    arrivalStation: arrival,
    option: option,
    waypoints: waypoints,
  });
  return data;
};

export const postInsideStationURL = async ({ line, stationName, stationType }: InsideStationPath): Promise<string> => {
  const { data } = await apiClient.post("/route-info/image-path", {
    line: line,
    stationName: stationName,
    stationType: stationType,
  });
  return data;
};

export const postCoordsData = async ({ line, stationName, connectedStation, exitNum, stationType }: InsideStationCoordinates): Promise<string> => {
  const { data } = await apiClient.post("/route-info/coordinates", {
    line: line,
    stationName: stationName,
    connectedStation: connectedStation,
    exitNum: exitNum,
    stationType: stationType,
  });
  return data;
};

