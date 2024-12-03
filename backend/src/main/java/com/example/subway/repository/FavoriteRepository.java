package com.example.subway.repository;

import com.example.subway.entity.FavoriteEntity;
import com.example.subway.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Long> {

    // 회원의 즐겨찾기 목록 조회
    List<FavoriteEntity> findByMemberId(Long memberId);

    // 회원의 즐겨찾기 항목 삭제
    void deleteByMemberIdAndStationId(Long memberId, Long stationId);

    List<Long> findStationIdByMemberId(Long memberId);

    boolean existsByMemberIdAndStationId(Long memberId, Long stationId);

    // 회원의 즐겨찾기 리스트를 stationName 기준으로 내림차순 정렬
    List<FavoriteEntity> findByMemberOrderByStation_StationNameAsc(MemberEntity member);
}
