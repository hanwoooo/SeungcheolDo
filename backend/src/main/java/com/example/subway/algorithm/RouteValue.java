package com.example.subway.algorithm;

import java.util.ArrayList;
import java.util.List;

public class RouteValue {
    int station; // 현재 탐색할 역
    int timeValue; // 현재까지 시간 누적값
    int distanceValue; // 현재까지 거리 누적값
    int costValue; // 현재까지 시간 누적값
    int transferValue; // 현재까지 환승 횟수 누적값
    int line; // 현재 호선
    List<Integer> route; // 출발역부터 현재역까지의 경로 List

    public RouteValue(int station, int timeValue, int distanceValue, int costValue, int transferValue, int line, List<Integer> route){
        this.station = station;
        this.timeValue = timeValue;
        this.distanceValue = distanceValue;
        this.costValue = costValue;
        this.transferValue = transferValue;
        this.line = line;
        this.route = new ArrayList<>(route);
    }
}
