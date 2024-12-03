package com.example.subway.repository;

import com.example.subway.entity.StationDirectionEntity;
import com.example.subway.entity.StationExitEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StationExitRepository extends JpaRepository<StationExitEntity, Long> {
    Optional<StationExitEntity> findByStationDirectionAndExitNumber(StationDirectionEntity stationDirectionEntity, String exitNum);
}
