package com.example.subway.repository;

import com.example.subway.entity.LineStationEntity;
import com.example.subway.entity.TransferStationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TransferStationRepository extends JpaRepository<TransferStationEntity, Long> {

    @Query("SELECT t.imagePath FROM TransferStationEntity t WHERE t.lineStation = :lineStation")
    String findImagePathByLineStation(LineStationEntity lineStation);
}
