package com.example.subway.service;

import com.example.subway.dto.StationDetailDto;
import com.example.subway.dto.StationDto;
import com.example.subway.entity.RouteEntity;
import com.example.subway.entity.StationEntity;
import com.example.subway.repository.RouteRepository;
import com.example.subway.repository.StationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StationService {

    private final StationRepository stationRepository;
    private final FavoriteService favoriteService;
    private final RouteRepository routeRepository;



    public StationService(StationRepository stationRepository, FavoriteService favoriteService, RouteRepository routeRepository) {
        this.stationRepository = stationRepository;
        this.favoriteService = favoriteService;
        this.routeRepository = routeRepository;
    }

    public List<StationDto> getAllStation() {
        List<StationEntity> stationEntityList = stationRepository.findAll();
        List<StationDto> stationDtoList = new ArrayList<>();
        for (StationEntity stationEntity : stationEntityList) {
            stationDtoList.add(StationDto.toStationDTO(stationEntity));
        }
        return stationDtoList;
    }

    public StationDto findStationByStationName(String stationName) {
        Optional<StationEntity> station = stationRepository.findByStationName(stationName);
        if (station.isPresent()) {
            return StationDto.toStationDTO(station.get());
        } else {
            return null;
        }
    }

    public Long findStationIdByStationName(String stationName) {
        Optional<Long> stationId = stationRepository.findStationIdByStationName(stationName);
        if (stationId.isPresent()) {
            return stationId.get();
        } else {
            return null;
        }
    }


    @Transactional
    public List<StationDto> findAllStationsWithoutFavorites(Long memberId) {
        // 전체 역 리스트
        List<StationDto> allStations = getAllStation();

        // 회원의 즐겨찾기 역 리스트
        List<StationDto> favoriteStations = favoriteService.getFavorites(memberId);

        // 즐겨찾기한 역 제외한 역 리스트 생성
        List<StationDto> stationsWithoutFavorites = new ArrayList<>();

        for (StationDto station : allStations) {
            // 즐겨찾기 역에 포함되지 않은 역만 추가
            if (!favoriteStations.contains(station)) {
                stationsWithoutFavorites.add(station);
            }
        }

        return stationsWithoutFavorites;
    }


    public StationDetailDto findStationDetailByName(String stationName) {
        // 주어진 역 이름으로 StationEntity 조회
        Optional<StationEntity> station = stationRepository.findByStationName(stationName);

        // 역이 존재하지 않으면 예외를 던짐
        if (station.isPresent()) {
            Long stationId = station.get().getId();

            // 해당 역과 연결된 모든 경로를 조회
            List<RouteEntity> connectedRoutes = routeRepository.findConnectedRoutesByStationId(stationId);

            // 노선별로 연결된 역 정보를 담을 리스트 생성
            List<StationDetailDto.LineDirectionInfo> connectedStations = new ArrayList<>();

            // 노선별로 LineDirectionInfo 객체를 저장할 맵 생성
            Map<String, StationDetailDto.LineDirectionInfo> lineDirectionMap = new HashMap<>();

            // 연결된 각 경로에 대해 반복 처리
            for (RouteEntity route : connectedRoutes) {
                Long arrivalStationId = route.getArrivalStation().getId();
                Long departureStationId = route.getDepartureStation().getId();
                String line = route.getLine();

                // 현재 노선에 대한 LineDirectionInfo 객체가 없으면 새로 생성
                StationDetailDto.LineDirectionInfo lineDirectionInfo = lineDirectionMap.getOrDefault(line, new StationDetailDto.LineDirectionInfo());
                lineDirectionInfo.setLine(line);

                // 도착역이 현재 역인 경우
                if (stationId.equals(arrivalStationId)) {
                    String direction = "previous"; // 도착역
                    if (stationId == 1) {
                        direction = "next";
                    }
                    String endStation = getEndStation(stationId, departureStationId, line); // 방면 계산
                    if (lineDirectionInfo.getConnectedStationsInfo() == null) {
                        lineDirectionInfo.setConnectedStationsInfo(new ArrayList<>());
                    }
                    // 연결된 출발역 정보를 추가
                    StationDetailDto.StationInfo stationInfo = new StationDetailDto.StationInfo(direction, route.getDepartureStation().getStationName(), endStation);
                    lineDirectionInfo.getConnectedStationsInfo().add(stationInfo);
                }

                // 출발역이 현재 역인 경우
                if (stationId.equals(departureStationId)) {
                    String direction = "next"; //
                    if (stationId == 1) {
                        direction = "previous";
                    }
                    String endStation = getEndStation(stationId, arrivalStationId, line); // 방면 계산
                    if (lineDirectionInfo.getConnectedStationsInfo() == null) {
                        lineDirectionInfo.setConnectedStationsInfo(new ArrayList<>());
                    }
                    // 연결된 도착역 정보를 추가
                    StationDetailDto.StationInfo stationInfo = new StationDetailDto.StationInfo(direction, route.getArrivalStation().getStationName(), endStation);
                    lineDirectionInfo.getConnectedStationsInfo().add(stationInfo);
                }

                // 맵에 노선에 대한 연결 정보 저장
                lineDirectionMap.put(line, lineDirectionInfo);
            }

            // 맵에 저장된 정보를 리스트로 변환하여 반환
            connectedStations.addAll(lineDirectionMap.values());

            // 조회된 역과 연결된 역들에 대한 정보를 담은 DTO 반환
            return new StationDetailDto(station.get().getStationName(), connectedStations);
        }

        // 역이 존재하지 않으면 예외를 던짐
        return null;
    }


    // stationId와 connectedStationId에 따른 방면을 결정하는 함수
    public String getEndStation(Long stationId, Long connectedStationId, String line) {
        // 각 라인에 대한 조건을 확인하여 방면을 결정
        switch (line) {
            case "1":
                if ((stationId == 23 && connectedStationId == 1) || (stationId == 1 && connectedStationId == 23)) {
                    return stationId < connectedStationId ? "시계방향" : "반시계방향";
                }
                if (stationId > connectedStationId) {
                    return "시계방향";
                } else if (stationId < connectedStationId) {
                    return "반시계방향";
                }
                break;
            case "2":
                if (stationId > connectedStationId) {
                    return "101방면";
                } else if (stationId < connectedStationId) {
                    return "217방면";
                }
                break;
            case "3":
                if ((stationId == 48 && connectedStationId == 7) || (stationId == 7 && connectedStationId == 48)) {
                    return stationId < connectedStationId ? "207방면" : "107방면";
                }
                if (stationId > connectedStationId) {
                    return "207방면";
                } else if (stationId < connectedStationId) {
                    return "107방면";
                }
                break;
            case "4":
                if ((stationId == 49 && connectedStationId == 47) || (stationId == 47 && connectedStationId == 49)
                        || (stationId == 55 && connectedStationId == 15) || (stationId == 15 && connectedStationId == 55)
                        || (stationId == 65 && connectedStationId == 39) || (stationId == 39 && connectedStationId == 65)) {
                    return stationId < connectedStationId ? "216방면" : "104방면";
                }
                if (stationId > connectedStationId) {
                    return "216방면";
                } else if (stationId < connectedStationId) {
                    return "104방면";
                }
                break;
            case "5":
                if ((stationId == 69 && connectedStationId == 12) || (stationId == 12 && connectedStationId == 69)
                        || (stationId == 71 && connectedStationId == 51) || (stationId == 51 && connectedStationId == 71)
                        || (stationId == 72 && connectedStationId == 9) || (stationId == 9 && connectedStationId == 72)) {
                    return stationId < connectedStationId ? "209방면" : "109방면";
                }
                if (stationId > connectedStationId) {
                    return "209방면";
                } else if (stationId < connectedStationId) {
                    return "109방면";
                }
                break;
            case "6":
                if ((stationId == 74 && connectedStationId == 12) || (stationId == 12 && connectedStationId == 74)
                        || (stationId == 78 && connectedStationId == 16) || (stationId == 16 && connectedStationId == 78)
                        || (stationId == 81 && connectedStationId == 60) || (stationId == 60 && connectedStationId == 81)
                        || (stationId == 88 && connectedStationId == 65) || (stationId == 65 && connectedStationId == 88)
                        || (stationId == 94 && connectedStationId == 73) || (stationId == 73 && connectedStationId == 94)) {
                    return stationId < connectedStationId ? "시계방향" : "반시계방향";
                }
                if (stationId > connectedStationId) {
                    return "시계방향";
                } else if (stationId < connectedStationId) {
                    return "반시계방향";
                }
                break;
            case "7":
                if (stationId > connectedStationId) {
                    return "202방면";
                } else if (stationId < connectedStationId) {
                    return "614방면";
                }
                break;
            case "8":
                if ((stationId == 104 && connectedStationId == 57) || (stationId == 57 && connectedStationId == 104)
                        || (stationId == 107 && connectedStationId == 99) || (stationId == 99 && connectedStationId == 107)
                        || (stationId == 99 && connectedStationId == 90) || (stationId == 90 && connectedStationId == 99)
                        || (stationId == 90 && connectedStationId == 37) || (stationId == 37 && connectedStationId == 90)) {
                    return stationId < connectedStationId ? "113방면" : "214방면";
                }
                if (stationId > connectedStationId) {
                    return "113방면";
                } else if (stationId < connectedStationId) {
                    return "214방면";
                }
                break;
            case "9":
                if ((stationId == 111 && connectedStationId == 96) || (stationId == 96 && connectedStationId == 111)
                        || (stationId == 110 && connectedStationId == 19) || (stationId == 19 && connectedStationId == 110)
                        || (stationId == 109 && connectedStationId == 77) || (stationId == 77 && connectedStationId == 109)
                        || (stationId == 77 && connectedStationId == 54) || (stationId == 54 && connectedStationId == 77)) {
                    return stationId < connectedStationId ? "112방면" : "211방면";
                }
                if (stationId > connectedStationId) {
                    return "112방면";
                } else if (stationId < connectedStationId) {
                    return "211방면";
                }
                break;
        }

        return "Unknown Direction"; // 기본값 (예외 처리 안된 경우)
    }

}
