package com.example.subway.repository;

import com.example.subway.entity.StationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface StationRepository extends JpaRepository<StationEntity, Long> {

    Optional<StationEntity> findByStationName(String stationName);

    Optional<StationEntity> findById(Long id);

    @Query("SELECT s.id FROM StationEntity s WHERE s.stationName = :stationName")
    Optional<Long> findStationIdByStationName(String stationName);
}
