package com.example.subway.controller;

import com.example.subway.dto.*;
import com.example.subway.entity.MemberEntity;
import com.example.subway.service.MemberService;
import com.example.subway.service.StationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping
public class StationController {

    private final StationService stationService;
    private final MemberService memberService;

    public StationController(StationService stationService, MemberService memberService) {
        this.stationService = stationService;
        this.memberService = memberService;
    }

    // 역 검색
    @PostMapping("/stations")
    public ResponseEntity<StationDto> findStationByName(@RequestParam String stationName) {
        StationDto station = stationService.findStationByStationName(stationName);
        if (station != null) {
            return ResponseEntity.ok(station);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // 역 검색 자세히 ( 노선 별 연결된 역 )
    @PostMapping("/stations/detail")
    public ResponseEntity<StationDetailDto> findStationDetailByName(@RequestParam String stationName) {
        StationDetailDto station = stationService.findStationDetailByName(stationName);
        if (station != null) {
            return ResponseEntity.ok(station);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // 즐겨찾기를 제외한 전체 역 리스트
    @GetMapping("/stations/without-favorites")
    public ResponseEntity<List<StationDto>> findAllStationsWithoutFavorites(HttpSession session) {

        MemberEntity member = memberService.getMemberFromSession(session);
        return ResponseEntity.ok(stationService.findAllStationsWithoutFavorites(member));
    }

}