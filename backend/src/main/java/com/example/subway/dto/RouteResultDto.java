package com.example.subway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteResultDto {
    private List<Map<Integer, List<String>>> path; // <역~환승역까지의 누적값, 역~환승역 리스트>의 리스트
    private int totalValue; // 최종 누적 값 (예: 최소 비용, 최소 시간 등)
}
