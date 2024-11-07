package com.example.subway.repository;

import com.example.subway.entity.FavoriteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Long> {

    // 회원의 즐겨찾기 목록 조회
    List<FavoriteEntity> findByMemberId(Long memberId);

    // 회원의 즐겨찾기 항목 삭제
    void deleteByMemberIdAndStationId(Long memberId, Long stationId);
}
