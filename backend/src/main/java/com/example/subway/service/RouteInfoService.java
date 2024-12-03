package com.example.subway.service;

import com.example.subway.dto.RouteInfoDto;
<<<<<<< HEAD
=======
import com.example.subway.dto.StationDetailDto;
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
import com.example.subway.entity.*;
import com.example.subway.repository.*;
import org.springframework.stereotype.Service;

<<<<<<< HEAD
import java.util.Optional;
=======
import java.util.*;
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2

@Service
public class RouteInfoService {

    private final StationRepository stationRepository;
    private final LineRepository lineRepository;
    private final LineStationRepository lineStationRepository;
    private final StationDirectionRepository stationDirectionRepository;
<<<<<<< HEAD
=======
    private final RouteRepository routeRepository;
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
    private final TransferStationCoordinateRepository transferStationCoordinateRepository;
    private final StationExitRepository stationExitRepository;
    private final StationExitCoordinateRepository stationExitCoordinateRepository;
    private final TransferStationRepository transferStationRepository;
    private final StationService stationService;

<<<<<<< HEAD
    public RouteInfoService(StationRepository stationRepository, LineRepository lineRepository, LineStationRepository lineStationRepository, StationDirectionRepository stationDirectionRepository, TransferStationCoordinateRepository transferStationCoordinateRepository, StationExitRepository stationExitRepository, StationExitCoordinateRepository stationExitCoordinateRepository, TransferStationRepository transferStationRepository, StationService stationService) {
=======
    public RouteInfoService(StationRepository stationRepository, LineRepository lineRepository, LineStationRepository lineStationRepository, StationDirectionRepository stationDirectionRepository, RouteRepository routeRepository, TransferStationCoordinateRepository transferStationCoordinateRepository, StationExitRepository stationExitRepository, StationExitCoordinateRepository stationExitCoordinateRepository, TransferStationRepository transferStationRepository, StationService stationService) {
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
        this.stationRepository = stationRepository;
        this.lineRepository = lineRepository;
        this.lineStationRepository = lineStationRepository;
        this.stationDirectionRepository = stationDirectionRepository;
<<<<<<< HEAD
=======
        this.routeRepository = routeRepository;
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
        this.transferStationCoordinateRepository = transferStationCoordinateRepository;
        this.stationExitRepository = stationExitRepository;
        this.stationExitCoordinateRepository = stationExitCoordinateRepository;
        this.transferStationRepository = transferStationRepository;
        this.stationService = stationService;
    }

    // 내부길찾기 좌표 반환
    public String getCoordinates(RouteInfoDto routeInfoDto) {
<<<<<<< HEAD
        String direction = getStationDirection(
                routeInfoDto.getStationName(),
                routeInfoDto.getConnectedStationName(),
                routeInfoDto.getLine()
        );
=======
        String connectedStation = "";

>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2

        Optional<StationEntity> station = stationRepository.findByStationName(routeInfoDto.getStationName());
        Optional<LineEntity> line = lineRepository.findByLineName(String.valueOf(routeInfoDto.getLine()));
        Optional<LineStationEntity> lineStation = lineStationRepository.findByLineAndStation(line.get(), station.get());
<<<<<<< HEAD
        Optional<StationDirectionEntity> stationDirection = stationDirectionRepository.findByLineStationAndDirection(lineStation.get(), direction);

        // 환승 상황이 아닐 때
        if(!routeInfoDto.isTransfer()) {
=======

        // 출발, 환승 상황일 때
        Long stationId = station.get().getId();

        // 해당 역과 연결된 모든 경로를 조회
        List<RouteEntity> connectedRoutes = routeRepository.findConnectedRoutesByStationIdAndLine(stationId, routeInfoDto.getLine());

        // 연결된 각 경로에 대해 반복 처리
        for (RouteEntity route : connectedRoutes) {
            Long arrivalStationId = route.getArrivalStation().getId();
            Long departureStationId = route.getDepartureStation().getId();
            if (routeInfoDto.getStationType().equals("departure") || routeInfoDto.getStationType().equals("transfer")) {
                // 출발 역이 현재 역인 경우.
                if (stationId.equals(departureStationId)) {
                    connectedStation = stationRepository.findById(arrivalStationId).get().getStationName();
                }
            } else if (routeInfoDto.getStationType().equals("arrival")) {
                if (stationId.equals(arrivalStationId)) {

                    connectedStation = stationRepository.findById(departureStationId).get().getStationName();

                }
            }
        }
        String direction = getStationDirection(
                routeInfoDto.getStationName(),
                connectedStation,
                routeInfoDto.getLine()
        );
        Optional<StationDirectionEntity> stationDirection = stationDirectionRepository.findByLineStationAndDirection(lineStation.get(), direction);

        if (routeInfoDto.getStationType().equals("departure") || routeInfoDto.getStationType().equals("arrival")) {
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
            Optional<StationExitEntity> stationExit = stationExitRepository.findByStationDirectionAndExitNumber(stationDirection.get(), routeInfoDto.getExitNum());
            Optional<String> coordinates = stationExitCoordinateRepository.findCoordinatesByStationExit(stationExit.get());
            return coordinates.get();
        }
        // 환승 상황일 때
        else {
            Optional<String> coordinates = transferStationCoordinateRepository.findCoordinatesByStationExit(stationDirection.get());
            return coordinates.get();
        }
    }

    // 방면에 따른 방향 판단
    private String getStationDirection(String stationName, String connectedStationName, String line) {
        Long stationId = stationService.findStationIdByStationName(stationName);
        Long connectedStationId = stationService.findStationIdByStationName(connectedStationName);
        String endStation = stationService.getEndStation(stationId, connectedStationId, line);
<<<<<<< HEAD
=======
        System.out.println("끝역: " + endStation);
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
        switch (endStation) {
            case "반시계방향", "217방면", "207방면", "104방면", "209방면", "202방면", "113방면", "112방면":
                return "LEFT";
            case "시계방향", "101방면", "107방면", "216방면", "109방면", "614방면", "214방면", "211방면":
                return "RIGHT";
        }
        return "Unknown Direction";
    }

    // 역 내 이미지 경로 반환
    public String getStationMapImagePath(RouteInfoDto routeInfoDto) {
        System.out.println(routeInfoDto);
        Optional<StationEntity> station = stationRepository.findByStationName(routeInfoDto.getStationName());
        Optional<LineEntity> line = lineRepository.findByLineName(routeInfoDto.getLine());
        Optional<LineStationEntity> lineStation = lineStationRepository.findByLineAndStation(line.get(), station.get());
<<<<<<< HEAD
        if(!routeInfoDto.isTransfer()) {
            return lineStationRepository.findImagePathByLineAndStation(line.get(), station.get());
        } else {
            return transferStationRepository.findImagePathByLineStation(lineStation.get());
=======
        if (routeInfoDto.getStationType().equals("transfer")) {
            return transferStationRepository.findImagePathByLineStation(lineStation.get());
        } else {
            return lineStationRepository.findImagePathByLineAndStation(line.get(), station.get());
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
        }
    }
}
