package com.example.subway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteDto {

<<<<<<< HEAD
    private String departureStation;
    private String arrivalStation;
    private String option;
    private List<String> waypoints;
//            = new ArrayList<>(List.of("-1"));
=======
    private String departureStation; // 출발역 이름
    private String arrivalStation; // 도착역 이름
    private String option; // 경로 탐색 옵션 (최단시간, 최단거리, 최저요금, 최소환승)
    private List<String> waypoints; // 경유지
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
}
