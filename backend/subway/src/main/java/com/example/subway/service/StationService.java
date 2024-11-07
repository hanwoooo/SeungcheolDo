package com.example.subway.service;

import com.example.subway.dto.StationDto;
import com.example.subway.entity.StationEntity;
import com.example.subway.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StationService {

    private final StationRepository stationRepository;



    public StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    public List<StationDto> getAllStation() {
        List<StationEntity> stationEntityList = stationRepository.findAll();
        List<StationDto> stationDtoList = new ArrayList<>();
        for (StationEntity stationEntity : stationEntityList) {
            stationDtoList.add(StationDto.toStationDTO(stationEntity));
        }
        return stationDtoList;
    }

    public StationDto findByStationName(String stationName) {
        Optional<StationEntity> optionalStationEntity = stationRepository.findByStationName(stationName);
        if (optionalStationEntity.isPresent()) {
            return StationDto.toStationDTO(optionalStationEntity.get());
        } else {
            return null;
        }
    }

    public StationDto findByStationId(Long stationId) {
        Optional<StationEntity> optionalStationEntity = stationRepository.findById(stationId);
        if (optionalStationEntity.isPresent()) {
            return StationDto.toStationDTO(optionalStationEntity.get());
        } else {
            return null;
        }
    }

    public Long findStationIdByName(String stationName) {
        Optional<StationEntity> optionalStationEntity = stationRepository.findByStationName(stationName);
        if (optionalStationEntity.isPresent()) {
            return optionalStationEntity.get().getId();
        } else {
            return null;
        }
    }

}
