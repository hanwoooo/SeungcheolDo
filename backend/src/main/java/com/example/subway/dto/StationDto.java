package com.example.subway.dto;

import com.example.subway.entity.StationEntity;
import lombok.Data;

@Data
public class StationDto {

    private String stationName;

    public static StationDto toStationDTO(StationEntity stationEntity) {
        StationDto stationDTO = new StationDto();
        stationDTO.setStationName(stationEntity.getStationName());
        return stationDTO;
    }

}
