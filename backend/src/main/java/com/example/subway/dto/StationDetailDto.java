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
    private String stationName;
    private Map<Integer, List<Map<String, String>>> connectedStations;
}
