package com.example.subway.controller;

import com.example.subway.dto.PathWithTotalValue;
import com.example.subway.dto.StationDto;
import com.example.subway.service.RouteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping("/route")
    public ResponseEntity<PathWithTotalValue> getRoute(@RequestParam String departureStation, @RequestParam String arrivalStation, @RequestParam String option) {
        try {
            PathWithTotalValue routeResult = routeService.findRoute(departureStation, arrivalStation, option);
            return ResponseEntity.ok(routeResult);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

}