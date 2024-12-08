package com.example.subway.algorithm;

import java.util.List;

public class ReturnRoute {
    int line; // 호선 번호
    List<Integer> eachLineRoute; //호선별 경로
    int eachLineTime; // 구간별 소요 시간


    public ReturnRoute(int line, List<Integer> eachLineRoute, int eachLineTime){
        this.line = line;
        this.eachLineRoute = eachLineRoute;
        this.eachLineTime = eachLineTime;
    }

}