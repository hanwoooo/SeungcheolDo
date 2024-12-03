package com.example.subway.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.subway.entity.RouteEntity;

import io.lettuce.core.dynamic.annotation.Param;

public interface RouteRepository extends JpaRepository<RouteEntity, Long> {

    @Query("SELECT r FROM RouteEntity r WHERE r.departureStation.id = :stationId OR r.arrivalStation.id = :stationId")
    List<RouteEntity> findConnectedRoutesByStationId(@Param("stationId") Long stationId);

    @Query("SELECT r FROM RouteEntity r " +
            "WHERE (r.departureStation.id = :stationId OR r.arrivalStation.id = :stationId) " +
            "AND r.line = :line")
    List<RouteEntity> findConnectedRoutesByStationIdAndLine(@Param("stationId") Long stationId, @Param("line") String line);
}
