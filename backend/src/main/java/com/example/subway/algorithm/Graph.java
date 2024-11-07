package com.example.subway.algorithm;

import com.example.subway.dto.PathWithTotalValue;

import java.util.*;

public class Graph {
    private Map<Integer, List<Edge>> stationList; //각 역마다의 경로를 저장하는 리스트
    private Map<Integer, String> stationNames; // // 각 역의 이름을 저장하고 이름으로 ID도 조회할 수 있는 Map


    public Graph() {
        stationList = new HashMap<>();
        stationNames = new HashMap<>();
    }


    // 역 추가 메서드
    public void addStation(int stationId, String stationName) {
        stationNames.put(stationId, stationName); // 역 ID와 이름 저장
    }

    // 경로 추가 메서드
    public void addEdge(int departure, int destination, int time, int distance, int cost, int line) { //특정역 departure에서 도착역 destination으로 가는 경로 추가
        stationList.putIfAbsent(departure, new ArrayList<>()); //입력값이 없다면 추가
        stationList.get(departure).add(new Edge(destination, time, distance, cost, line)); //departure에서 출발하는 리스트 저장

        // 역방향 경로 추가
        stationList.putIfAbsent(destination, new ArrayList<>());
        stationList.get(destination).add(new Edge(departure, time, distance, cost, line));
    }

    // 역 이름 조회 메서드
    public String getStationName(int stationId) {
        return stationNames.getOrDefault(stationId, "Unknown Station");
    }

    // 역 id 조회 메서드
    public int getStationId(String stationName) {
        for (Map.Entry<Integer, String> entry : stationNames.entrySet()) {
            if (entry.getValue().equals(stationName)) {
                return entry.getKey();
            }
        }
        return -1;
    }

    // 다익스트라 알고리즘 - 경로 탐색
    public PathWithTotalValue findRoute(String startName, String endName, String valueKind) {
        int start = getStationId(startName);
        int end = getStationId(endName);
        if (start == -1 || end == -1) {
            System.out.println("입력한 역 이름이 존재하지 않습니다.");
            return new PathWithTotalValue(Collections.emptyList(), -1);
        }
        return dijkstra(start, end, valueKind);
    }



    // 공통 다익스트라 알고리즘
    public PathWithTotalValue dijkstra(int start, int end, String valueKind) {
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(arr -> arr[1])); // 누적 값이 가장 작은 역이 앞으로
        Map<Integer, Integer> value = new HashMap<>(); // 각 역까지의 누적 값 저장
        Map<Integer, Integer> predecessors = new HashMap<>(); // 계산하는 각 역의 이전역 저장

        pq.offer(new int[]{start, 0, -1}); // 시작 역에 누적 값 0 추가, 초기 호선은 -1
        value.put(start, 0);

        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int currentStation = current[0]; // 누적 값이 가장 작은 역
            int currentAccumulateValue = current[1]; // 해당 누적값
            int currentLine = current[2]; // 현재 노선 번호

            if (currentStation == end) { // 도착역에 도달하면 종료
                return new PathWithTotalValue(getPath(predecessors, end), currentAccumulateValue); // 출발역 ~ 도착역까지의 경로, 기준값 종류, 누적값 반환
            }

            if (stationList.containsKey(currentStation)) { // 현재 탐색할 인접역들이 리스트에 있는지 확인
                for (Edge edge : stationList.get(currentStation)) { // 인접역 탐색
                    int newValue = currentAccumulateValue + getAttribute(edge, valueKind); // 각 인접 역에 대한 새로운 누적값 계산

                    if (valueKind.equals("line")) {
                        // 환승이 발생하는 경우: 현재 노선과 다음 노선이 다를 때
                        if (currentLine != -1 && currentLine != edge.line) {
                            newValue = currentAccumulateValue + 1; // 다른 호선으로 이동하면 환승 횟수 증가
                        }
                    }

                    if (newValue < value.getOrDefault(edge.destination, Integer.MAX_VALUE)) { // 새로운 누적값이 기존 누적값보다 작을 시
                        value.put(edge.destination, newValue); // 누적값 갱신
                        predecessors.put(edge.destination, currentStation); // 경로 추가
                        pq.offer(new int[]{edge.destination, newValue, edge.line}); // 현재 역을 큐에 추가
                    }
                }
            }
        }

        System.out.println("경로를 찾을 수 없음"); // 도착 못할 시 출력
        return new PathWithTotalValue(Collections.emptyList(), -1); // 경로를 찾지 못했을 때 빈 리스트와 -1 반환
    }

    // Edge에서 특정 속성 값 가져오기
    private int getAttribute(Edge edge, String value_kind) {
        switch (value_kind) {
            case "time":
                return edge.time;
            case "distance":
                return edge.distance;
            case "cost":
                return edge.cost;
            case "line":
                return edge.line;
            default:
                throw new IllegalArgumentException("잘못된 기준: " + value_kind); //기준 값이 잘못됐음을 알림
        }
    }

    // 최종 경로를 리스트로 반환
    private List<String> getPath(Map<Integer, Integer> predecessors, int end) {
        List<Integer> path = new ArrayList<>();
        for (Integer now = end; now != null; now = predecessors.get(now)) {
            path.add(now);
        }
        Collections.reverse(path);

        List<String> pathNames = new ArrayList<>();
        for (Integer stationId : path) {
            pathNames.add(getStationName(stationId)); // 역 이름 추가
        }

        return pathNames;
    }
}