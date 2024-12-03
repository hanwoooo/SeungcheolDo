{/*import { DijkstraResult, StationData, StationInformation, Stationlist } from "@/types/domain";

const mockStationData: StationData[] = [
  {
    stationName: "101",
    connectedStations: [
      {
        line: "1",
        connectedStationsInfo: [
          { direction: "previous", stationName: "102", endStation: "반시계" },
          { direction: "next", stationName: "123", endStation: "시계" },
        ],
      },
      {
        line: "2",
        connectedStationsInfo: [
          { direction: "next", stationName: "201", endStation: "217" },
        ],
      },
    ],
  },
  {
    stationName: "303",
    connectedStations: [
      {
        line: "3",
        connectedStationsInfo: [
          { direction: "previous", stationName: "302", endStation: "207" },
          { direction: "next", stationName: "304", endStation: "107" },
        ],
      },
      {
        line: "7",
        connectedStationsInfo: [
          { direction: "previous", stationName: "202", endStation: "202" },
          { direction: "next", stationName: "503", endStation: "614" },
        ],
      },
    ],
  },
  // 다른 역 데이터...
];

const mockStationList: Stationlist = [
  { stationName: "101" },
  { stationName: "303" },
  // 다른 역 이름...
];

export const getMockStationData = (stationName: string): StationData | undefined => {
  return mockStationData.find(station => station.stationName === stationName);
};

export const getMockStationList = (): Stationlist => {
  return mockStationList;
};

export const mockDijkstraResult: DijkstraResult = {
  routeResults: [
    {
      line: '1',
      path: ['101', '123'],
      timeValue: 480,
    },
    {
      line: '3',
      path: ['123', '304', '203', '302', '301'],
      timeValue: 1430,
    },
  ],
  valueResults: {
    time: 1910, // 총 소요 시간
    distance: 1900, // 거리
    cost: 2190, // 비용
    transfer: 1, // 환승 횟수
  },
};

// 임시로 사용할 mockPostRoute 함수
export const mockPostRoute = async (): Promise<DijkstraResult> => {
  // 실제 네트워크 요청 대신 mock 데이터를 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDijkstraResult);
    }, 500); // 0.5초 지연 후 반환
  });
};

export default mockStationData;
*/}
