package com.example.subway.algorithm;

import java.util.List;

public class ReturnRoute {
    int line; // 호선 번호
    List<Integer> route; //호선별 경로를 나누기 위함
    int totalTime; // 구간별 총 소요 시간


    public ReturnRoute(int line, List<Integer> route, int totalTime){
        this.line = line;
        this.route = route;
        this.totalTime = totalTime;
    }

}