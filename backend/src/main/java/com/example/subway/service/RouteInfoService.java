package com.example.subway.service;

import com.example.subway.dto.RouteInfoDto;
import com.example.subway.entity.*;
import com.example.subway.repository.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RouteInfoService {

    private final StationRepository stationRepository;
    private final LineRepository lineRepository;
    private final LineStationRepository lineStationRepository;
    private final StationDirectionRepository stationDirectionRepository;
    private final TransferStationCoordinateRepository transferStationCoordinateRepository;
    private final StationExitRepository stationExitRepository;
    private final StationExitCoordinateRepository stationExitCoordinateRepository;
    private final TransferStationRepository transferStationRepository;
    private final StationService stationService;

    public RouteInfoService(StationRepository stationRepository, LineRepository lineRepository, LineStationRepository lineStationRepository, StationDirectionRepository stationDirectionRepository, TransferStationCoordinateRepository transferStationCoordinateRepository, StationExitRepository stationExitRepository, StationExitCoordinateRepository stationExitCoordinateRepository, TransferStationRepository transferStationRepository, StationService stationService) {
        this.stationRepository = stationRepository;
        this.lineRepository = lineRepository;
        this.lineStationRepository = lineStationRepository;
        this.stationDirectionRepository = stationDirectionRepository;
        this.transferStationCoordinateRepository = transferStationCoordinateRepository;
        this.stationExitRepository = stationExitRepository;
        this.stationExitCoordinateRepository = stationExitCoordinateRepository;
        this.transferStationRepository = transferStationRepository;
        this.stationService = stationService;
    }

    // 내부길찾기 좌표 반환
    public String getCoordinates(RouteInfoDto routeInfoDto) {
        String direction = getStationDirection(
                routeInfoDto.getStationName(),
                routeInfoDto.getConnectedStationName(),
                routeInfoDto.getLine()
        );

        Optional<StationEntity> station = stationRepository.findByStationName(routeInfoDto.getStationName());
        Optional<LineEntity> line = lineRepository.findByLineName(String.valueOf(routeInfoDto.getLine()));
        Optional<LineStationEntity> lineStation = lineStationRepository.findByLineAndStation(line.get(), station.get());
        Optional<StationDirectionEntity> stationDirection = stationDirectionRepository.findByLineStationAndDirection(lineStation.get(), direction);

        // 환승 상황이 아닐 때
        if(!routeInfoDto.isTransfer()) {
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
        if(!routeInfoDto.isTransfer()) {
            return lineStationRepository.findImagePathByLineAndStation(line.get(), station.get());
        } else {
            return transferStationRepository.findImagePathByLineStation(lineStation.get());
        }
    }
}
