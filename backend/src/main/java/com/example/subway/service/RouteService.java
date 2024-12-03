package com.example.subway.service;

import com.example.subway.algorithm.Graph;
import com.example.subway.repository.GraphLoader;
import com.example.subway.dto.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RouteService {

    private final Graph graph;


    public RouteService() {
        graph = new Graph();
        GraphLoader graphLoader = new GraphLoader(graph);
        graphLoader.loadGraphData();
    }

    // 경유지가 있을 경우 경로 탐색
    public DijkstraResult findRoute(String departureStationName, String arrivalStationName, List<String> waypoints, String option) {
        option = setOption(option);
        // 경유지 첫번째 역과 출발역이 같은 경우 && 경유지 마지막 역과 도착이 역이 같은 경우
        if (departureStationName.equals(waypoints.get(0))
                || arrivalStationName.equals(waypoints.get(waypoints.size() - 1))) {
            throw new IllegalArgumentException("올바르지 않은 입력 값입니다");
        }
        // 전체 경로와 누적 값을 저장하기 위한 DijkstraResult 객체 초기화
        DijkstraResult totalResult = new DijkstraResult(new ArrayList<>(), new DijkstraResult.TotalValueResult());
        DijkstraResult newResult;

        // 출발지 -> 첫 번째 경유지부터 시작하여 경유지들을 순차적으로 탐색
        String currentDeparture = departureStationName;
        for (String stopStationName : waypoints) {
            if (stopStationName.equals("경유 역 선택")) {
                continue;
            }
            // 출발지와 경유지 사이의 경로 찾기
            newResult = graph.findRoute(currentDeparture, stopStationName, option);
            mergeResultsWithTransfer(totalResult, newResult);
            // 다음 구간의 출발지를 현재 경유지로 설정
            currentDeparture = stopStationName;
        }
        // 마지막 경유지 -> 도착지 경로 탐색
        newResult = graph.findRoute(currentDeparture, arrivalStationName, option);
        mergeResultsWithTransfer(totalResult, newResult);

        return totalResult;
    }

    // 경유지가 없을 경우 경로 탐색
    public DijkstraResult findRoute(String departureStationName, String arrivalStationName, String option) {
        option = setOption(option);

        // 출발역과 도착역이 같은 경우
        if (departureStationName.equals(arrivalStationName)) {
            throw new IllegalArgumentException("올바르지 않은 입력 값입니다");
        }
        return graph.findRoute(departureStationName, arrivalStationName, option);
    }

    private String setOption(String option) {
        switch (option) {
            case ("최단시간"):
                option = "time";
                break;
            case ("최단거리"):
                option = "distance";
                break;
            case ("최저요금"):
                option = "cost";
                break;
            case ("최소환승"):
                option = "transfer";
                break;
        }
        return option;
    }

    // 각 경유 구간의 결과를 전체 결과에 합치는 메서드
    private void mergeResultsWithTransfer(DijkstraResult totalResult, DijkstraResult newResult) {

        // 전체 구간의 마지막 노선과 새로운 구간의 첫 노선이 동일할 때 합치기
        if (!totalResult.getRouteResults().isEmpty() && !newResult.getRouteResults().isEmpty()) {
            List<String> newPath = newResult.getRouteResults().get(0).getPath();
            int totalResultLastIndex = totalResult.getRouteResults().size() - 1;
            String totalResultLastLine = totalResult.getRouteResults().get(totalResultLastIndex).getLine();
            String newResultFirstLine = newResult.getRouteResults().get(0).getLine();
            if (totalResultLastLine.equals(newResultFirstLine)) {
                newPath.remove(0);
                totalResult.getRouteResults().get(totalResultLastIndex).getPath().addAll(newPath);
                totalResult
                        .getRouteResults()
                        .get(totalResultLastIndex)
                        .setTimeValue(
                                totalResult.getRouteResults().get(totalResultLastIndex).getTimeValue() +
                                        newResult.getRouteResults().get(0).getTimeValue()
                        );
                newResult.getRouteResults().remove(0);
            }
        }
        // 전체 구간 뒤에 새로운 구간 추가
        totalResult.getRouteResults().addAll(newResult.getRouteResults());

        // 전체 구간의 누적 값에 새로운 구간 누적값 더하기
        DijkstraResult.TotalValueResult totalValues = totalResult.getValueResults();
        DijkstraResult.TotalValueResult tempValues = newResult.getValueResults();

        totalValues.setTime(totalValues.getTime() + tempValues.getTime());
        totalValues.setCost(totalValues.getCost() + tempValues.getCost());
        totalValues.setDistance(totalValues.getDistance() + tempValues.getDistance());
        totalValues.setTransfer(totalValues.getTransfer() + tempValues.getTransfer());
    }
}
