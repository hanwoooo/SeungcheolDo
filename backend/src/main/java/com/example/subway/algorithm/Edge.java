package com.example.subway.algorithm;

import java.util.Objects;

public class Edge {
    int destination; // 도착역
    int time; // 소요 시간
    int distance; // 이동 거리
    int cost; // 비용
    int line; // 호선

    public Edge(int destination, int time, int distance, int cost, int line) {
        this.destination = destination; //도착역
        this.time = time; //소요 시간
        this.distance = distance; //이동 거리
        this.cost = cost; //비용
        this.line =line; //호선
    }
}
