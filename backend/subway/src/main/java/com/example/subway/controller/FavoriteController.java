package com.example.subway.controller;

import com.example.subway.dto.FavoriteDto;
import com.example.subway.entity.MemberEntity;
import com.example.subway.service.FavoriteService;
import com.example.subway.service.MemberService;
import com.example.subway.service.StationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final MemberService memberService;
    private final StationService stationService;

    public FavoriteController(FavoriteService favoriteService, MemberService memberService, StationService stationService) {
        this.favoriteService = favoriteService;
        this.memberService = memberService;
        this.stationService = stationService;
    }



    @GetMapping
    public ResponseEntity<List<FavoriteDto>> getMemberFavorites(HttpSession session) {
        MemberEntity member = memberService.getMemberFromSession(session);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<FavoriteDto> favoriteDtoList = favoriteService.getFavorites(member.getId());
        return ResponseEntity.ok(favoriteDtoList);
    }

    @PostMapping
    public ResponseEntity<String> addFavorite(HttpSession session, @RequestParam String stationName) {
        MemberEntity member = memberService.getMemberFromSession(session);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User session not found");
        }

        Long stationId = stationService.findStationIdByName(stationName);
        if (stationId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Station not found: " + stationName);
        }
        favoriteService.addFavorite(member.getId(), stationId);
        return ResponseEntity.ok("Favorite added successfully");
    }

    @DeleteMapping
    public ResponseEntity<String> deleteFavorite(HttpSession session, @RequestParam String stationName) {
        MemberEntity member = memberService.getMemberFromSession(session);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User session not found");
        }

        Long stationId = stationService.findStationIdByName(stationName);
        if (stationId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Station not found: " + stationName);
        }
        favoriteService.deleteFavorite(member.getId(), stationId);
        return ResponseEntity.ok("Favorite deleted successfully");
    }

}
