package com.example.subway.repository;

import com.example.subway.entity.StationDirectionEntity;
import com.example.subway.entity.TransferStationCoordinateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TransferStationCoordinateRepository extends JpaRepository<TransferStationCoordinateEntity, Long> {

    @Query("SELECT t.coordinates FROM TransferStationCoordinateEntity t WHERE t.stationDirection = :stationDirectionEntity")
    Optional<String> findCoordinatesByStationExit(StationDirectionEntity stationDirectionEntity);
}
