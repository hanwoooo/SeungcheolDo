package com.example.subway.algorithm;

import com.example.subway.dto.RouteResultDto;

import java.util.*;

public class Graph {
    private Map<Integer, Map<Integer, Edge>> routes; //각 역마다의 경로를 저장하는 Map
    private Map<Integer, String> stations; // // 각 역의 이름과 ID를 조회하는 Map

    public Graph() {
        routes = new HashMap<>();
        stations = new HashMap<>();
    }

    // 역 추가 메서드
    public void addStation(int stationId, String stationName) {
        stations.put(stationId, stationName); // 역 ID와 이름 저장
    }

    // 역 이름 조회 메서드
    public String getStationName(int stationId) {
        return stations.getOrDefault(stationId,
                "Unknown Station");
    }

    // 역 id 조회 메서드
    public int getStationId(String stationName) {
        for (Map.Entry<Integer, String> entry : stations.entrySet()) {
            if (entry.getValue().equals(stationName)) {
                return entry.getKey();
            }
        }
        return -1;
    }

    private List<String> getStationNamesFromId (List<Integer> stationIdPath) {
        List<String> stationNamePath = new ArrayList<>();

        for (Integer stationId : stationIdPath) {
            stationNamePath.add(getStationName(stationId)); // 역 이름 추가
        }

        return stationNamePath;
    }

    //경로 추가
    public void addEdge(int departure, int nextStation, int time, int distance, int cost, int line) {
        //특정역 departure에서 다음역에서 nextStation 가는 경로 추가
        //순방향 경로
        //입력값이 없다면 추가
        routes.putIfAbsent(departure, new HashMap<>());
        //departure에서  출발하는 리스트 저장
        routes.get(departure).put(nextStation, new Edge(nextStation, time, distance, cost, line));

        // 역방향 경로 추가
        routes.putIfAbsent(nextStation, new HashMap<>());
        routes.get(nextStation).put(departure, new Edge(departure, time, distance, cost, line));
    }

    // 다익스트라 알고리즘 - 경로 탐색
    public RouteResultDto findRoute(String departureStation, String arrivalStation, String option) {
        int start = getStationId(departureStation);
        int end = getStationId(arrivalStation);
        if (start == -1 || end == -1) {
            System.out.println(start);
            System.out.println(end);
            throw new IllegalArgumentException("존재하지 않는 역 이름");
        }

        if (option.equals("transfer")){
            ForGetPath forwardResult = FindMinTransferRoute(start, end);
            ForGetPath backwardResult = FindMinTransferRoute(end, start);
            // 두 경로 중 더 적은 누적 환승 값을 가진 경로 선택
            if (forwardResult.value.get(end).timeValue <= backwardResult.value.get(start).timeValue){
                return getPath(forwardResult, false);
            }else {
                return  getPath(backwardResult, true);
            }
        } else {
            return Dijkstra(start, end, option);
        }
    }
    private Comparator<RouteValue> getComparator(String value_kind){
        //기준이 되는 요소 결정
        // 우선 순위 : 시간 > 환승 > 비용 > 거리
        switch (value_kind) {
            case "time":
                return Comparator.comparingInt((RouteValue rv) -> rv.timeValue)  //시간 기준
                        .thenComparingInt(rv -> rv.transferValue)
                        .thenComparingInt(rv -> rv.costValue)
                        .thenComparingInt(rv -> rv.distanceValue);
            case "distance":
                return Comparator.comparingInt((RouteValue rv) -> rv.distanceValue) //거리 기준
                        .thenComparingInt(rv -> rv.timeValue)
                        .thenComparingInt(rv -> rv.transferValue)
                        .thenComparingInt(rv -> rv.distanceValue);
            case "cost":
                return Comparator.comparingInt((RouteValue rv) -> rv.costValue) //비용 기준
                        .thenComparingInt(rv -> rv.timeValue)
                        .thenComparingInt(rv -> rv.transferValue)
                        .thenComparingInt(rv -> rv.distanceValue);
            default:
                throw new IllegalArgumentException("잘못된 기준: " + value_kind);
        }
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
            case "transfer" :
                if (newValue.transferValue < existingRouteValue.transferValue) return true; //환승 횟수가 더 작다면 ture
                return (newValue.transferValue == existingRouteValue.transferValue && //환승 횟수가 같지만 시간이 더 작다면 ture
                        newValue.timeValue < existingRouteValue.timeValue);
            default:
                throw new IllegalArgumentException("잘못된 기준: " + value_kind);
        }
    }

    // 시간, 거리, 비용 공통 다익스트라 알고리즘
    private RouteResultDto Dijkstra(int start, int end, String value_kind) {
        Comparator<RouteValue> comparator = getComparator(value_kind);
        PriorityQueue<RouteValue> pq = new PriorityQueue<>(comparator); //누적 값이 가장 작은 역이 앞으로
        Map<Integer, RouteValue> value = new HashMap<>(); //각 역까지의 최적의 누적 값 저장
        Set<Integer> visited = new HashSet<>(); // 방문한 역를 저장하는 Set
        //초기 시작 모든값 0으로 초기화
        RouteValue startValue = new RouteValue(start, 0, 0, 0,
                0, 0, new ArrayList<>(List.of(start)));
        //우선 순위 큐에 초기값 넣기
        pq.offer(startValue);
        //출발역에서 시작을 위함
        value.put(start, startValue);

        while (!pq.isEmpty()) {
            RouteValue current = pq.poll(); //탐색할 경로 큐에서 꺼내기
            int currentStation = current.station; //탐색할 역 설정

            if (visited.contains(currentStation)) continue;
            visited.add(currentStation); //방문 역 표시

            if (currentStation == end) { //도착역에 도달 시
                return getPath(new ForGetPath(value, current), false);
            }

            if (routes.containsKey(currentStation)) { //현재 탐색할 역이 경로를 가지고 있는지 확인
                for (Edge edge : routes.get(currentStation).values()) { //현재역에서 인접 경로 탐색
                    int nextStation = edge.nextStation;
                    int newTimeValue = current.timeValue + edge.time;
                    int newDistanceValue = current.distanceValue + edge.distance;
                    int newCostValue = current.costValue + edge.cost;
                    //시작역이 아니고 다른 노선으로 환승시 +1
                    int newTransferValue = (current.line != 0 && current.line != edge.line)
                            ? current.transferValue + 1 : current.transferValue;
                    List<Integer> newRoute = new ArrayList<>(current.routeFromStart);
                    newRoute.add(nextStation);

                    //인접 경로에 대한 새로운 RouteValue 갱신
                    RouteValue newRouteValue = new RouteValue(nextStation,
                            newTimeValue,
                            newDistanceValue,
                            newCostValue,
                            newTransferValue,
                            edge.line,
                            newRoute);

                    //isBetterRoute 메서드로 newRouteValue가 더 작은지 판단하고 갱신
                    if (isBetterRoute(newRouteValue, value.get(nextStation), value_kind)) {
                        value.put(nextStation, newRouteValue); //누적값 갱신
                        pq.offer(newRouteValue); //새로운 경로 삽입
                    }
                }
            }
        }
        throw new IllegalArgumentException("경로를 찾을 수 없음");
    }

    // 도착역의 호선 정보 -> 휴리스틱 환승
    private Set<Integer> getStationLines(int station) {
        Set<Integer> lines = new HashSet<>();
        if (routes.containsKey(station)) {
            for (Edge edge : routes.get(station).values()) {
                lines.add(edge.line); // 연결된 모든 호선을 추가
            }
        }
        return lines;
    }

    //휴리스틱 계산을 위함 출발역~도착역 최소 시간
    private int calculateShortestTime(int start, int end) {
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1])); // 시간 기준 정렬
        Map<Integer, Integer> minTime = new HashMap<>(); // 각 역별 최소 시간 저장
        Set<Integer> visited = new HashSet<>(); // 방문 저장

        //시작을 위한 초기화
        pq.offer(new int[]{start, 0}); // {현재 역, 누적 시간}
        minTime.put(start, 0);  // 출발역에서 시작

        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int currentStation = current[0]; // 현재 탐색 중인 역
            int currentTime = current[1]; // 현재 누적 시간

            if (visited.contains(currentStation)) continue; // 이미 방문한 역이면 통과
            visited.add(currentStation);

            if (currentStation == end) return currentTime; // 도착 역에 도달 시 최소 시간 반환

            if (routes.containsKey(currentStation)) {
                for (Edge edge : routes.get(currentStation).values()) {
                    int nextStation = edge.nextStation;
                    int newTime = currentTime + edge.time;

                    if (!minTime.containsKey(nextStation) || newTime < minTime.get(nextStation)) {
                        minTime.put(nextStation, newTime);
                        pq.offer(new int[]{nextStation, newTime}); //새로운 경로 삽입
                    }
                }
            }
        }
        return Integer.MAX_VALUE; // 도달 불가능한 경우
    }

    // 휴리스틱 계산
    private int[] heuristic(RouteValue rv, int end) {
        int[] arrayH = new int[2];  //휴리스틱 배열
        int currentLine = rv.line;  // 현재 호선
        Set<Integer> endLines = getStationLines(end);  // 도착역의 호선 집합

        // 환승 횟수 추정: 현재 호선이 도착역의 호선에 포함되면 환승 없음
        int estimatedTransfers = endLines.contains(currentLine) ? 0 : 1;
        arrayH[0] = estimatedTransfers;
        // 현재역 부터 도착역 까지의 예상 시간은 최소 시간으로 가정
        int timeValue = calculateShortestTime(rv.station, end);
        arrayH[1] = timeValue;
        return arrayH;
    }





    // 최소 환승 경로 탐색 A*알고리즘
    public ForGetPath FindMinTransferRoute(int start, int end) {
        Comparator<RouteValue> comparator = Comparator.comparingInt((RouteValue rv)
                        -> rv.transferValue + heuristic(rv, end)[0]) //환승 기준
                .thenComparingInt(rv -> rv.timeValue + heuristic(rv, end)[1]);

        PriorityQueue<RouteValue> pq = new PriorityQueue<>(comparator);
        Map<Integer, RouteValue> value = new HashMap<>(); // 각 역까지의 최적의 누적 값 저장
        Set<String> visited = new HashSet<>(); // 방문 경로 저장을 통한 중복 탐지 방지

        // 초기 상태 추가
        RouteValue startValue = new RouteValue(start, 0, 0,
                0, 0, 0, new ArrayList<>(List.of(start)));
        pq.offer(startValue);
        value.put(start, startValue);

        while (!pq.isEmpty()) {
            RouteValue current = pq.poll();
            int currentStation = current.station;

            // 도착지에 도달한 경우
            if (currentStation == end) return new ForGetPath(value, current);

            // 인접 역 탐색
            if (routes.containsKey(current.station)) {
                for (Edge edge : routes.get(current.station).values()) {
                    int nextStation = edge.nextStation;
                    String edgeKey = currentStation + "," + nextStation; //탐색한 경로
                    String reverseEdgeKey =  nextStation + "," + currentStation; //탐색한 경로의 역방향 탐색 방지

                    if (visited.contains(edgeKey) || visited.contains(reverseEdgeKey)) continue; //방문한 경로는 탐색 안함
                    visited.add(edgeKey); //현재 탐색경로 방문 표시

                    int newTimeValue = current.timeValue + edge.time;
                    int newDistanceValue = current.distanceValue + edge.distance;
                    int newCostValue = current.costValue + edge.cost;
                    int newTransferValue = (current.line != 0 && current.line != edge.line)
                            ? current.transferValue + 1 : current.transferValue;

                    //인접 경로에 대한 새로운 RouteValue 갱신
                    List<Integer> newRoute = new ArrayList<>(current.routeFromStart);
                    newRoute.add(nextStation);
                    RouteValue newRouteValue = new RouteValue(nextStation,
                            newTimeValue,
                            newDistanceValue,
                            newCostValue,
                            newTransferValue,
                            edge.line,
                            newRoute);
                    //isBetterRoute 메서드로 newRouteValue가 더 작은지 판단하고 갱신
                    if (isBetterRoute(newRouteValue, value.get(nextStation), "transfer")) {
                        value.put(nextStation, newRouteValue);
                        pq.offer(newRouteValue); //새로운 경로 삽입
                    }
                }
            }
        }
        throw new IllegalArgumentException("경로를 찾을 수 없습니다.");
    }



    // 최종 경로와 모든 누적 값 출력
    private RouteResultDto getPath(ForGetPath resultRoute, boolean is_reverse){
        List<ReturnRoute> totalRoute = new ArrayList<>(); // 구간별 정보를 저장하는 리스트
        int currentLine = resultRoute.current.line; // 초기 호선 값
        List<Integer> currentRoute = new ArrayList<>(); // 현재 구간의 역 리스트
        int segmentTime = 0; // 현재 구간의 소요 시간

        // 도착역부터 출발역까지 역추적하며 구간을 나눔
        for (int i = resultRoute.current.routeFromStart.size() - 1; i >= 0; i--) {
            int currentStation = resultRoute.current.routeFromStart.get(i);
            if (is_reverse){
                currentRoute.add(currentStation);
            }else {
                currentRoute.add(0, currentStation);
            }
            // 이전 역이 있다면 소요 시간을 누적
            if (i > 0) {
                int prevStation = resultRoute.current.routeFromStart.get(i - 1); //역추적이기에 이전역으로
                segmentTime +=  routes.get(currentStation).get(prevStation).time; // +현재역에서 이전역으로 가는 시간

                // 환승이 발생하면 현재 구간 저장 후 초기화
                if (resultRoute.value.get(currentStation).line != resultRoute.value.get(prevStation).line) {
                    //환승역의 경우 두번씩
                    if (is_reverse) {
                        currentRoute.add(prevStation); // 환승역은 다음 구간에도 포함
                    }else {
                        currentRoute.add(0, prevStation); // 환승역은 다음 구간에도 포함
                    }
                    totalRoute.add(new ReturnRoute(currentLine, new ArrayList<>(currentRoute), segmentTime));
                    currentRoute.clear();
                    segmentTime = 0; // 구간 시간 초기화
                    currentLine = resultRoute.value.get(prevStation).line; // 다음 호선으로 갱신
                }
            }
        }
        if (!is_reverse) {
            Collections.reverse(totalRoute); //호선 순서 뒤집기 1->2->3 호선이라면 3->2->1호선의 순서로
        }

        RouteResultDto dijkstraResult = new RouteResultDto(new ArrayList<>(),
                new RouteResultDto.TotalValueResult());
        // 결과 넣기
        for (ReturnRoute route : totalRoute) {
            RouteResultDto.RouteResult result = new RouteResultDto.RouteResult(String.valueOf(route.line),
                    getStationNamesFromId(route.eachLineRoute), route.eachLineTime);
            dijkstraResult.getRouteResults().add(result);
        }
        // 총 누적 값 넣기
        RouteResultDto.TotalValueResult result = new RouteResultDto.TotalValueResult(resultRoute.current.timeValue,
                resultRoute.current.distanceValue, resultRoute.current.costValue, resultRoute.current.transferValue);
        dijkstraResult.setValueResults(result);
        return dijkstraResult;
    }
}
