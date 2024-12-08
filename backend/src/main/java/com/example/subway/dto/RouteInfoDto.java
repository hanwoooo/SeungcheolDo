package com.example.subway.dto;

import lombok.Data;

@Data
public class RouteInfoDto {

    private String line; // 노선
    private String stationName; // 역 이름
    // 연결된 역 이름으로 stationType이 departure 와 transfer 인 경우는 경로 상에서 현재 역의 이후 역 이름,
    // arrival 인 경우는 경로 상에서 현재 역의 이전 역 이름을 저장
    private String connectedStation;
    private String exitNum; // 출구번호
    private String stationType; // 해당 역이 출발역인지 환승역인지 도착역인지 departure, transfer, arrival
}
