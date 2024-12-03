package com.example.subway.controller;

import com.example.subway.dto.RouteInfoDto;
import com.example.subway.service.RouteInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class RouteInfoController {

    private final RouteInfoService routeInfoService;

    public RouteInfoController(RouteInfoService routeInfoService) {
        this.routeInfoService = routeInfoService;
    }

    // 역 내 좌표 반환
    @PostMapping("/route-info/coordinates")
    public ResponseEntity<String> getCoordinates(@RequestBody RouteInfoDto routeInfoDto) {
        return ResponseEntity.ok(routeInfoService.getCoordinates(routeInfoDto));
    }

    // 역 내부 지도 경로 반환
    @PostMapping("/route-info/image-path")
    public ResponseEntity<String> getStationMapImagePath(@RequestBody RouteInfoDto routeInfoDto) {
        System.out.println(routeInfoDto);
        return ResponseEntity.ok(routeInfoService.getStationMapImagePath(routeInfoDto));
    }
}
