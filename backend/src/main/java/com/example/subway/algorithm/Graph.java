package com.example.subway.algorithm;

import com.example.subway.dto.DijkstraResult;

import java.util.*;

public class Graph {
    private Map<Integer, Map<Integer, Edge>> route; //각 역마다의 경로를 저장하는 Map
    private Map<Integer, String> station; // // 각 역의 이름과 ID를 조회하는 Map

    public Graph() {
        route = new HashMap<>();
        station = new HashMap<>();
    }

    // 역 추가 메서드
    public void addStation(int stationId, String stationName) {
        station.put(stationId, stationName); // 역 ID와 이름 저장
    }

    // 역 이름 조회 메서드
    public String getStationName(int stationId) {
        return station.getOrDefault(stationId, "Unknown Station");
    }

    // 역 id 조회 메서드
    public int getStationId(String stationName) {
        for (Map.Entry<Integer, String> entry : station.entrySet()) {
            if (entry.getValue().equals(stationName)) {
                return entry.getKey();
            }
        }
        return -1;
    }

    //경로 추가
    public void addEdge(int departure, int destination, int time, int distance, int cost, int line) {
        //특정역 departure에서 도착역 destination으로 가는 경로 추가
        //순방향 경로 - 기본 데이터
        route.putIfAbsent(departure, new HashMap<>()); //입력값이 없다면 추가
        route.get(departure).put(destination, new Edge(destination, time, distance, cost, line)); //departure에서 출발하는 리스트 저장

        // 역방향 경로 추가
        route.putIfAbsent(destination, new HashMap<>());
        route.get(destination).put(departure, new Edge(departure, time, distance, cost, line));
    }

    // 다익스트라 알고리즘 - 경로 탐색
    public DijkstraResult findRoute(String departureStation, String arrivalStation, String option) {
        int start = getStationId(departureStation);
        int end = getStationId(arrivalStation);
        if (start == -1 || end == -1) {
            System.out.println(start);
            System.out.println(end);
            throw new IllegalArgumentException("존재하지 않는 역 이름");
        }
        if (option.equals("transfer")){
            return FindMinTransferRoute(start, end);
        } else {
            return Dijkstra(start, end, option);
        }
    }

    // 휴리스틱 계산
    private int[] heuristic(RouteValue rv, int end) {
        int[] ReturH = new int[2];
        // 현재 호선
        int currentLine = rv.line;

        // 도착역의 호선 집합
        Set<Integer> endLines = getStationLines(end);

        // 환승 횟수 추정: 현재 호선이 도착역의 호선 집합에 포함되면 환승 없음
        int estimatedTransfers = endLines.contains(currentLine) ? 0 : 1;
        ReturH[0] = estimatedTransfers;
        // 도착역 까지의 최소 소요 시간
        int timeValue = calculateShortestTime(rv.station, end);
        ReturH[1] = timeValue;
        return ReturH;
    }

    //탐색역에서 도착역까지의 시간 값 반환 -> 휴리스틱 시간
    private int calculateShortestTime(int start, int end) {
        PriorityQueue<RouteValue> pq = new PriorityQueue<>(Comparator.comparingInt(rv -> rv.timeValue));
        Set<Integer> visited = new HashSet<>();
        Map<Integer, Integer> minTime = new HashMap<>();

        pq.offer(new RouteValue(start, 0, 0, 0, 0, 0, new ArrayList<>()));
        minTime.put(start, 0);

        while (!pq.isEmpty()) {
            RouteValue current = pq.poll();

            if (visited.contains(current.station)) continue;
            visited.add(current.station);

            if (current.station == end) return current.timeValue;

            if (route.containsKey(current.station)) {
                for (Edge edge : route.get(current.station).values()) {
                    int nextStation = edge.destination;
                    int newTime = current.timeValue + edge.time;

                    if (!visited.contains(nextStation) && (!minTime.containsKey(nextStation) || newTime < minTime.get(nextStation))) {
                        minTime.put(nextStation, newTime);
                        pq.offer(new RouteValue(nextStation, newTime, 0, 0, 0, edge.line, new ArrayList<>()));
                    }
                }
            }
        }
        return Integer.MAX_VALUE; // 도달 불가능한 경우
    }

    // 도착역의 호선 정보 -> 휴리스틱 환승
    private Set<Integer> getStationLines(int station) {
        Set<Integer> lines = new HashSet<>();
        if (route.containsKey(station)) {
            for (Edge edge : route.get(station).values()) {
                lines.add(edge.line); // 연결된 모든 호선을 추가
            }
        }
        return lines;
    }

    // 최소 환승 경로 탐색 A*알고리즘
    public DijkstraResult FindMinTransferRoute(int start, int end) {        //Dijkstra(start, end, "line");
        Comparator<RouteValue> comparator = Comparator.comparingInt((RouteValue rv) -> rv.transferValue + heuristic(rv, end)[0]) //환승 기준
                .thenComparingInt(rv -> rv.timeValue + heuristic(rv, end)[1]);


        PriorityQueue<RouteValue> pq = new PriorityQueue<>(comparator);
        Map<Integer, RouteValue> value = new HashMap<>(); // 각 역까지의 최적의 누적 값 저장
        Set<String> visited = new HashSet<>(); // "역,호선"을 저장하여 중복 탐색 방지

        // 초기 상태 추가
        RouteValue startValue = new RouteValue(start, 0, 0, 0, 0, 0, new ArrayList<>(List.of(start)));
        pq.offer(startValue);
        value.put(start, startValue);

        while (!pq.isEmpty()) {
            RouteValue current = pq.poll();

            // 도착지에 도달한 경우
            if (current.station == end) {
                return getPath(value,current);
            }
            // 인접 역 탐색
            if (route.containsKey(current.station)) {
                for (Edge edge : route.get(current.station).values()) {
                    String edgeKey = current.station + "," + edge.destination;
                    String reverseEdgeKey =  edge.destination + "," + current.station;

                    if (visited.contains(reverseEdgeKey)) {
                        continue;
                    }
                    int newTransfers = (current.line != 0 && current.line != edge.line) ? current.transferValue + 1 : current.transferValue;

                    List<Integer> newRoute = new ArrayList<>(current.route);
                    newRoute.add(edge.destination);
                    RouteValue newRouteValue = new RouteValue(edge.destination,
                            current.timeValue + edge.time,
                            current.distanceValue + edge.distance,
                            current.costValue + edge.cost,
                            newTransfers,
                            edge.line,
                            newRoute);
                    value.put(edge.destination, newRouteValue);
                    pq.offer(newRouteValue);
                    visited.add(edgeKey);
                }
            }
        }

        System.out.println("경로를 찾을 수 없습니다.");
        throw new IllegalArgumentException("경로를 찾을 수 없습니다.");
    }

    // 시간, 거리, 비용 공통 다익스트라 알고리즘
    private DijkstraResult Dijkstra(int start, int end, String value_kind) {

        //기준이 되는 요소 결정
        // 우선 순위 : 시간 > 환승 > 비용 > 거리
        Comparator<RouteValue> comparator;
        switch (value_kind) {
            case "time":
                comparator = Comparator.comparingInt((RouteValue rv) -> rv.timeValue)   //시간 기준
                        .thenComparingInt(rv -> rv.transferValue)
                        .thenComparingInt(rv -> rv.costValue)
                        .thenComparingInt(rv -> rv.distanceValue);
                break;
            case "distance":
                comparator = Comparator.comparingInt((RouteValue rv) -> rv.distanceValue) //거리 기준
                        .thenComparingInt(rv -> rv.timeValue)
                        .thenComparingInt(rv -> rv.transferValue)
                        .thenComparingInt(rv -> rv.distanceValue);
                break;
            case "cost":
                comparator = Comparator.comparingInt((RouteValue rv) -> rv.costValue) //비용 기준
                        .thenComparingInt(rv -> rv.timeValue)
                        .thenComparingInt(rv -> rv.transferValue)
                        .thenComparingInt(rv -> rv.distanceValue);
                break;
            default:
                throw new IllegalArgumentException("잘못된 기준:" + value_kind);
        }

        PriorityQueue<RouteValue> pq = new PriorityQueue<>(comparator); //누적 값이 가장 작은 역이 앞으로
        Map<Integer, RouteValue> value = new HashMap<>(); //각 역까지의 최적의 누적 값 저장
        Set<String> visited = new HashSet<>(); // 방문한 경로를 저장하는 Set
        //초기 시작 모든값 0으로 초기화
        RouteValue startValue = new RouteValue(start, 0, 0, 0, 0, 0, new ArrayList<>(List.of(start)));
        //우선 순위 큐에 초기시작 넣기
        pq.offer(startValue);
        //출발역에서 시작을 위함
        value.put(start, startValue);

        while (!pq.isEmpty()) {
            RouteValue current = pq.poll(); //탐색할 경로 큐에서 꺼내기
            int currentStation = current.station; //탐색할 역 설정

            if (currentStation == end) { //도착역에 도달 시
                return getPath(value,current);
            }

            if (route.containsKey(currentStation)) { //현재 탐색할 인접역들이 리스트에 있는지 확인
                for (Edge edge : route.get(currentStation).values()) { //현재역에서 인접 경로 탐색
                    String edgeKey = currentStation + "," + edge.destination;
                    String reverseEdgeKey = edge.destination + "," + currentStation;

                    // 중복 탐색 방지: 역방향 경로가 이미 방문된 경우 생략
                    if (visited.contains(reverseEdgeKey)) {
                        continue;
                    }

                    int newTimeValue = current.timeValue + edge.time;
                    int newDistanceValue = current.distanceValue + edge.distance;
                    int newCostValue = current.costValue + edge.cost;
                    //시작이 아니고 다른 노선으로 환승시 +1
                    int newTransferValue = (current.line != 0 && current.line != edge.line) ? current.transferValue + 1 : current.transferValue;
                    List<Integer> newRoute = new ArrayList<>(current.route);
                    newRoute.add(edge.destination);

                    //인접 경로에 대한 새로운 RouteValue 갱신
                    RouteValue newRouteValue = new RouteValue(edge.destination,
                            newTimeValue,
                            newDistanceValue,
                            newCostValue,
                            newTransferValue,
                            edge.line,
                            newRoute);

                    //isBetterRoute 메서드로 newRouteValue가 더 작은지 판단하고 갱신
                    if (isBetterRoute(newRouteValue, value.get(edge.destination), value_kind)) {
                        value.put(edge.destination, newRouteValue); //누적값 갱신
                        //갱신한역까지 추가
                        pq.offer(newRouteValue); //큐에 누적값 저장
                    }
                    visited.add(edgeKey); // 방문한 경로 저장
                }
            }
        }
        System.out.println("경로를 찾을 수 없음");
        throw new IllegalArgumentException("경로를 찾을 수 없음");
    }

    // 최종 경로와 모든 누적 값 출력 -> getPath
    private DijkstraResult getPath(Map<Integer, RouteValue> value, RouteValue current){

        List<ReturnRoute> totalRoute = new ArrayList<>(); // 구간별 정보를 저장하는 리스트
        int currentLine = current.line; // 초기 호선 값
        List<Integer> currentRoute = new ArrayList<>(); // 현재 구간의 역 리스트
        int segmentTime = 0; // 현재 구간의 소요 시간

        // 도착역부터 출발역까지 역추적하며 구간을 나눔
        for (int i = current.route.size() - 1; i >= 0; i--) {
            int station = current.route.get(i);
            currentRoute.add(0, station);

            // 다음 역이 있다면 소요 시간을 누적
            if (i > 0) {
                int nextStation = current.route.get(i - 1);
                Edge edge = route.get(station).get(nextStation);
                segmentTime += edge.time;

                // 환승이 발생하면 현재 구간 저장 후 초기화
                if (value.get(station).line != value.get(nextStation).line) {
                    currentRoute.add(0, nextStation); // 환승역은 다음 구간에도 포함
                    totalRoute.add(new ReturnRoute(currentLine, new ArrayList<>(currentRoute), segmentTime));
                    currentRoute.clear();
                    currentLine = value.get(nextStation).line; // 다음 호선으로 갱신
                    segmentTime = 0; // 구간 시간 초기화
                }
            }
        }
        Collections.reverse(totalRoute); //호선 순서 뒤집기
        DijkstraResult dijkstraResult = new DijkstraResult(new ArrayList<>(), new DijkstraResult.TotalValueResult());

        // 결과 넣기
        for (ReturnRoute route : totalRoute) {
            DijkstraResult.RouteResult result = new DijkstraResult.RouteResult(String.valueOf(route.line), getStationNamesFromId(route.route), route.totalTime);
            dijkstraResult.getRouteResults().add(result);
        }

        // 총 누적 값 넣기
        DijkstraResult.TotalValueResult result = new DijkstraResult.TotalValueResult(current.timeValue, current.distanceValue, current.costValue, current.transferValue);
        dijkstraResult.setValueResults(result);

        return dijkstraResult;
    }

    private List<String> getStationNamesFromId (List<Integer> stationIdPath) {
        List<String> stationNamePath = new ArrayList<>();

        for (Integer stationId : stationIdPath) {
            stationNamePath.add(getStationName(stationId)); // 역 이름 추가
        }

        return stationNamePath;
    }


    //더 나은 경로인지 확인 하는 메서드
    private boolean isBetterRoute(RouteValue newValue, RouteValue existingRouteValue, String value_kind) {
        if (existingRouteValue == null) return true;

        switch (value_kind) {
            case "time":
                return newValue.timeValue < existingRouteValue.timeValue;
            case "distance":
                return newValue.distanceValue < existingRouteValue.distanceValue;
            case "cost":
                return newValue.costValue < existingRouteValue.costValue;
            default:
                throw new IllegalArgumentException("잘못된 기준: " + value_kind);
        }
    }
}
