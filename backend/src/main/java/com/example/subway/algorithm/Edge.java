package com.example.subway.algorithm;

public class Edge {
    int nextStation; // 다음역
    int time; // 시간
    int distance; // 거리
    int cost; // 비용
    int line; // 호선

    public Edge(int nextStation, int time, int distance, int cost, int line) {
        this.nextStation = nextStation;
        this.time = time;
        this.distance = distance;
        this.cost = cost;
        this.line =line;
    }
}
