package com.example.subway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StationDetailDto {
    private String stationName; // 역이름
    private List<LineDirectionInfo> connectedStations; // 각 노선의 방면 및 연결 정보 리스트
    @Data
    public static class LineDirectionInfo {
        private String line; // 노선 이름
        private List<StationInfo> connectedStationsInfo; // 인접 역 정보
    }
    @Data
    @AllArgsConstructor
    public static class StationInfo {
        private String direction; // previous , next
        private String stationName; // 역 이름
        private String endStation; // 방면
    }

}