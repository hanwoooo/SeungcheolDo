package com.example.subway.repository;

import com.example.subway.entity.LineEntity;
import com.example.subway.entity.LineStationEntity;
import com.example.subway.entity.StationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface LineStationRepository extends JpaRepository<LineStationEntity, Long> {

    Optional<LineStationEntity> findByLineAndStation(LineEntity lineEntity, StationEntity stationEntity);

    @Query("SELECT l.imagePath FROM LineStationEntity l WHERE l.line = :lineEntity AND l.station = :stationEntity")
    String findImagePathByLineAndStation(LineEntity lineEntity, StationEntity stationEntity);
}
