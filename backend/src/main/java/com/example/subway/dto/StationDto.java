package com.example.subway.dto;

import com.example.subway.entity.FavoriteEntity;
import com.example.subway.entity.StationEntity;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StationDto {

    private String stationName;

    public static StationDto toStationDTO(StationEntity stationEntity) {
        StationDto stationDTO = new StationDto();
        stationDTO.setStationName(stationEntity.getStationName());
        return stationDTO;
    }

    public StationDto(StationEntity stationEntity) {
        this.stationName = stationEntity.getStationName();
    }

}
