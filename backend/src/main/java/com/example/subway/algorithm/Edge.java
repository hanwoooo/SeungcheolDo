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
<<<<<<< HEAD
    // equals와 hashCode 메서드를 오버라이드하여 동일한 출발-도착 경로인지 비교
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Edge edge = (Edge) obj;
        return destination == edge.destination && time == edge.time && distance == edge.distance && cost == edge.cost && line == edge.line;
    }

    @Override
    public int hashCode() {
        return Objects.hash(destination, time, distance, cost, line);
    }
=======
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
}
