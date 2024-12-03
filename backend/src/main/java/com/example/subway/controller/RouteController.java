package com.example.subway.controller;

import com.example.subway.dto.DijkstraResult;
import com.example.subway.dto.RouteDto;
import com.example.subway.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class RouteController {

    private final RouteService routeService;

    @Autowired
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    // 경로 탐색
    @PostMapping("/routes")
    public ResponseEntity<DijkstraResult> getRoute(@RequestBody RouteDto routeDto) {
        try {
            // 경유지 없는 경우
            if (routeDto.getWaypoints().isEmpty()) {
                DijkstraResult routeResult = routeService.findRoute(
                        routeDto.getDepartureStation(),
                        routeDto.getArrivalStation(),
                        routeDto.getOption()
                );
                return ResponseEntity.ok(routeResult);
            // 경유지 있는 경우
            } else {
                DijkstraResult routeResult = routeService.findRoute(
                        routeDto.getDepartureStation(),
                        routeDto.getArrivalStation(),
                        routeDto.getWaypoints(),
                        routeDto.getOption()
                );
                return ResponseEntity.ok(routeResult);
            }
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}