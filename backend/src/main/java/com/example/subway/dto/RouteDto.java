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

    private String departureStation; // 출발역 이름
    private String arrivalStation; // 도착역 이름
    private String option; // 경로 탐색 옵션 (최단시간, 최단거리, 최저요금, 최소환승)
    private List<String> waypoints; // 경유지
}