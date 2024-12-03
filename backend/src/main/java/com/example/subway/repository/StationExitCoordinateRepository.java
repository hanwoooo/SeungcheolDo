package com.example.subway.repository;

import com.example.subway.entity.StationExitCoordinateEntity;
import com.example.subway.entity.StationExitEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface StationExitCoordinateRepository extends JpaRepository<StationExitCoordinateEntity, Long> {

    @Query("SELECT c.coordinates FROM StationExitCoordinateEntity c WHERE c.stationExit = :stationExitEntity")
    Optional<String> findCoordinatesByStationExit(StationExitEntity stationExitEntity);
}
