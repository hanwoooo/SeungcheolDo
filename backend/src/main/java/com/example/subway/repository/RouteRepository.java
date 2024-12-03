package com.example.subway.repository;

import com.example.subway.entity.LineEntity;
import com.example.subway.entity.RouteEntity;
import com.example.subway.entity.StationEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RouteRepository extends JpaRepository<RouteEntity, Long> {

    @Query("SELECT r FROM RouteEntity r WHERE r.departureStation.id = :stationId OR r.arrivalStation.id = :stationId")
    List<RouteEntity> findConnectedRoutesByStationId(@Param("stationId") Long stationId);

    @Query("SELECT r FROM RouteEntity r " +
            "WHERE (r.departureStation.id = :stationId OR r.arrivalStation.id = :stationId) " +
            "AND r.line = :line")
    List<RouteEntity> findConnectedRoutesByStationIdAndLine(@Param("stationId") Long stationId, @Param("line") String line);
}