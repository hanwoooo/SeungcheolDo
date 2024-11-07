package com.example.subway.controller;

import com.example.subway.dto.*;
import com.example.subway.service.RouteService;
import com.example.subway.service.StationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/stations")
public class StationController {

    private final StationService stationService;
    private final RouteService routeService;

    public StationController(StationService stationService, RouteService routeService) {
        this.stationService = stationService;
        this.routeService = routeService;
    }

    @GetMapping
    public ResponseEntity<List<StationDto>> getAllStations() {
        return ResponseEntity.ok(stationService.getAllStation());
    }

    @PostMapping
    public ResponseEntity<StationDetailDto> findStationByName(@RequestParam String stationName) {
        StationDetailDto station = routeService.findStationByName(stationName);
        if (station != null) {
            return ResponseEntity.ok(station);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
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