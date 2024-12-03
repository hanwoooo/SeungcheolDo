package com.example.subway.repository;

import com.example.subway.entity.LineStationEntity;
import com.example.subway.entity.StationDirectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StationDirectionRepository extends JpaRepository<StationDirectionEntity, Long> {

    Optional<StationDirectionEntity> findByLineStationAndDirection(LineStationEntity lineStationEntity, String direction);

    Optional<StationDirectionEntity> findById(Long id);
}