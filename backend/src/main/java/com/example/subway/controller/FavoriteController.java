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

<<<<<<< HEAD
        List<StationDto> favoriteList = favoriteService.getFavorites(member.getId());
=======
        List<StationDto> favoriteList = favoriteService.getFavorites(member);
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
        return ResponseEntity.ok(favoriteList);
    }

    // 즐겨찾기 추가
    @PostMapping("/favorites")
    public ResponseEntity<String> addFavorite(HttpSession session, @RequestParam String stationName) {
        MemberEntity member = memberService.getMemberFromSession(session);

        Long stationId = stationService.findStationIdByStationName(stationName);
<<<<<<< HEAD
        if (stationId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 역");
        }
=======
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2

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
<<<<<<< HEAD

        if (stationId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 역");
        }
=======
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
        favoriteService.deleteFavorite(member.getId(), stationId);
        return ResponseEntity.ok("삭제 성공");
    }

}
