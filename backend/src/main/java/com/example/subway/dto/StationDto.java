package com.example.subway.dto;

<<<<<<< HEAD
import com.example.subway.entity.FavoriteEntity;
=======
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
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
<<<<<<< HEAD

    public StationDto(StationEntity stationEntity) {
        this.stationName = stationEntity.getStationName();
    }

=======
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
}
