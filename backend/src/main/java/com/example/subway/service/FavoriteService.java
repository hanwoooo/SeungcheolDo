package com.example.subway.service;

import com.example.subway.dto.StationDto;
import com.example.subway.entity.FavoriteEntity;
import com.example.subway.entity.MemberEntity;
import com.example.subway.entity.StationEntity;
import com.example.subway.repository.FavoriteRepository;
import com.example.subway.repository.MemberRepository;
import com.example.subway.repository.StationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final MemberRepository memberRepository;
    private final StationRepository stationRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, MemberRepository memberRepository, StationRepository stationRepository) {
        this.favoriteRepository = favoriteRepository;
        this.memberRepository = memberRepository;
        this.stationRepository = stationRepository;
    }

    // 즐겨찾기에 역이 이미 존재하는지 확인
    public boolean isFavoriteExists(Long memberId, Long stationId) {
        return favoriteRepository.existsByMemberIdAndStationId(memberId, stationId);
    }

    public void addFavorite(Long memberId, Long stationId) {
        Optional<MemberEntity> member = memberRepository.findById(memberId);
        Optional<StationEntity> station = stationRepository.findById(stationId);

        FavoriteEntity favorite = new FavoriteEntity();
        favorite.setMember(member.get());
        favorite.setStation(station.get());
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void deleteFavorite(Long memberId, Long stationId) {
        favoriteRepository.deleteByMemberIdAndStationId(memberId, stationId);
    }

    @Transactional
    public List<StationDto> getFavorites(MemberEntity member) {


        // 해당 멤버의 즐겨찾기 리스트를 stationName 기준 오름차순으로 정렬하여 조회
        List<FavoriteEntity> favorites = favoriteRepository.findByMemberOrderByStation_StationNameAsc(member);

        // FavoriteEntity를 StationDto로 변환하여 반환
        List<StationDto> stationDtoList = new ArrayList<>();
        for (FavoriteEntity favoriteEntity : favorites) {
            stationDtoList.add(StationDto.toStationDTO(favoriteEntity.getStation()));
        }

        return stationDtoList;
    }


}
