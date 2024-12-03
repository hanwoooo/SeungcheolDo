package com.example.subway.controller;

import com.example.subway.dto.RouteInfoDto;
import com.example.subway.service.RouteInfoService;
<<<<<<< HEAD
=======
import org.springframework.beans.factory.annotation.Autowired;
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class RouteInfoController {

    private final RouteInfoService routeInfoService;

<<<<<<< HEAD
=======
    @Autowired
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
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
