package com.example.subway.dto;

import com.example.subway.entity.FavoriteEntity;
import lombok.Data;

@Data
public class FavoriteDto {

    private String memberEmail;
    private String stationName;

    public static FavoriteDto toFavoriteDTO(FavoriteEntity favoriteEntity) {
        FavoriteDto favoriteDto = new FavoriteDto();
        favoriteDto.setMemberEmail(favoriteEntity.getMember().getMemberEmail());
        favoriteDto.setStationName(favoriteEntity.getStation().getStationName());
        return favoriteDto;
    }
}
