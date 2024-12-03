package com.example.subway.controller;

import com.example.subway.dto.StationDto;
import com.example.subway.entity.MemberEntity;
import com.example.subway.service.FavoriteService;
import com.example.subway.service.MemberService;
import com.example.subway.service.StationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 로그인 이후에만 사용 가능
@RestController
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final MemberService memberService;
    private final StationService stationService;

    public FavoriteController(FavoriteService favoriteService, MemberService memberService, StationService stationService) {
        this.favoriteService = favoriteService;
        this.memberService = memberService;
        this.stationService = stationService;
    }

    // 전체 즐겨찾기 역 리스트
    @GetMapping("/favorites")
    public ResponseEntity<List<StationDto>> getMemberFavorites(HttpSession session) {
        MemberEntity member = memberService.getMemberFromSession(session);

        List<StationDto> favoriteList = favoriteService.getFavorites(member);
        return ResponseEntity.ok(favoriteList);
    }

    // 즐겨찾기 추가
    @PostMapping("/favorites")
    public ResponseEntity<String> addFavorite(HttpSession session, @RequestParam String stationName) {
        MemberEntity member = memberService.getMemberFromSession(session);

        Long stationId = stationService.findStationIdByStationName(stationName);

        boolean alreadyExists = favoriteService.isFavoriteExists(member.getId(), stationId);
        if (alreadyExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 추가된 즐겨찾기");
        }

        favoriteService.addFavorite(member.getId(), stationId);
        return ResponseEntity.ok("추가 성공");
    }

    // 즐겨찾기 제거
    @DeleteMapping("/favorites")
    public ResponseEntity<String> deleteFavorite(HttpSession session, @RequestParam String stationName) {
        MemberEntity member = memberService.getMemberFromSession(session);
        Long stationId = stationService.findStationIdByStationName(stationName);
        favoriteService.deleteFavorite(member.getId(), stationId);
        return ResponseEntity.ok("삭제 성공");
    }

}
