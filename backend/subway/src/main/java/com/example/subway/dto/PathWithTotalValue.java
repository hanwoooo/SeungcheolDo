package com.example.subway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PathWithTotalValue {
    private List<String> path; // 역 이름의 경로 리스트
    private int totalValue; // 최종 누적 값 (예: 최소 비용, 최소 시간 등)
}
