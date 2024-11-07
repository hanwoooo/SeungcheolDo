package com.example.subway.service;

import com.example.subway.algorithm.Graph;
import com.example.subway.algorithm.GraphLoader;
import com.example.subway.dto.*;
import com.example.subway.entity.RouteEntity;
import com.example.subway.entity.StationEntity;
import com.example.subway.repository.RouteRepository;
import com.example.subway.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    private final Graph graph;
    private final StationRepository stationRepository;


    public RouteService(RouteRepository routeRepository, StationRepository stationRepository) {
        this.routeRepository = routeRepository;
        graph = new Graph();
        GraphLoader graphLoader = new GraphLoader(graph);
        graphLoader.loadGraphData();
        this.stationRepository = stationRepository;
    }

    public PathWithTotalValue findRoute(String arrivalStationName, String departureStationName, String option) {

        switch (option.toLowerCase()) {
            case "time":
                return graph.findRoute(arrivalStationName, departureStationName, "time");
            case "distance":
                return graph.findRoute(arrivalStationName, departureStationName, "distance");
            case "cost":
                return graph.findRoute(arrivalStationName, departureStationName, "cost");
            case "transfer":
                return graph.findRoute(arrivalStationName, departureStationName, "line");
            default:
                throw new IllegalArgumentException("잘못된 옵션: " + option);
        }
    }

    public StationDetailDto findStationByName(String stationName) {
        Optional<StationEntity> station = stationRepository.findByStationName(stationName);
        if (station.isPresent()) {
        Long stationId = station.get().getId();
        // 특정 역과 연결된 모든 경로 가져오기
        List<RouteEntity> connectedRoutes = routeRepository.findConnectedRoutesByStationId(stationId);

        // 노선별로 연결된 역을 분류할 맵 생성
        Map<Integer, List<Map<String, String>>> connectedStations = new HashMap<>();

        for (RouteEntity route : connectedRoutes) {
            Long arrivalStationId = route.getArrivalStation().getId();
            Long departureStationId = route.getDepartureStation().getId();
            int line = route.getLine();

            Map<String, String> connectedStation = new HashMap<>();

            if (stationId.equals(departureStationId)) {
                connectedStation.put("stationName", route.getArrivalStation().getStationName());
                connectedStation.put("direction", "NEXT");
            } else if (stationId.equals(arrivalStationId)) {
                connectedStation.put("stationName", route.getDepartureStation().getStationName());
                connectedStation.put("direction", "PREVIOUS");
            } else {
                continue;
            }

            connectedStations.computeIfAbsent(line, k -> new ArrayList<>()).add(connectedStation);
        }

        StationEntity stationEntity = stationRepository.findById(stationId).orElseThrow(() -> new IllegalArgumentException("Station not found"));
        return new StationDetailDto(stationEntity.getStationName(), connectedStations);

        } else {
            return null;
        }
    }
}
