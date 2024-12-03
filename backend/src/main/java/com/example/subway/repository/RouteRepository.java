package com.example.subway.repository;

import com.example.subway.entity.RouteEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RouteRepository extends JpaRepository<RouteEntity, Long> {

    @Query("SELECT r FROM RouteEntity r WHERE r.departureStation.id = :stationId OR r.arrivalStation.id = :stationId")
    List<RouteEntity> findConnectedRoutesByStationId(@Param("stationId") Long stationId);
}
