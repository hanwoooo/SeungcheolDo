package com.example.subway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteResultDto {
    @Data
    @AllArgsConstructor
    public static class RouteResult {
        private String line;
        private List<String> path; // 이동간 노선별 경로 리스트
        private int timeValue; // 노선별 시간 비용 리스트
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TotalValueResult {
        private int time;
        private int distance;
        private int cost;
        private int transfer;
    }
    private List<RouteResult> routeResults;// RouteResult 리스트 추가
    private TotalValueResult valueResults; // 최종 누적 값 리스트(순서대로 시간,거리,비용,환승)
}
