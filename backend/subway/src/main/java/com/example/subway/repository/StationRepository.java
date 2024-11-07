package com.example.subway.repository;

import com.example.subway.entity.StationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StationRepository extends JpaRepository<StationEntity, Long> {

    Optional<StationEntity> findByStationName(String stationName);

    Optional<StationEntity> findById(Long Id);
}
