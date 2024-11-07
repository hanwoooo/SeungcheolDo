package com.example.subway.service;

import com.example.subway.dto.FavoriteDto;
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
import java.util.NoSuchElementException;

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

    public List<FavoriteDto> getFavorites(Long memberId) {
        List<FavoriteEntity> favoriteEntityList = favoriteRepository.findByMemberId(memberId);
        List<FavoriteDto> favoriteDtoList = new ArrayList<>();
        for (FavoriteEntity favoriteEntity : favoriteEntityList) {
            favoriteDtoList.add(FavoriteDto.toFavoriteDTO(favoriteEntity));
        }
        return favoriteDtoList;
    }

    public void addFavorite(Long memberId, Long stationId) {

        MemberEntity member = memberRepository.findById(memberId).orElseThrow(() -> new NoSuchElementException("Member not found"));
        StationEntity station = stationRepository.findById(stationId).orElseThrow(() -> new NoSuchElementException("Station not found"));

        FavoriteEntity favorite = new FavoriteEntity();
        favorite.setMember(member);
        favorite.setStation(station);
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void deleteFavorite(Long memberId, Long stationId) {
        favoriteRepository.deleteByMemberIdAndStationId(memberId, stationId);
    }
}
