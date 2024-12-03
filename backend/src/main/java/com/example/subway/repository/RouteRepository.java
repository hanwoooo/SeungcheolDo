package com.example.subway.repository;

<<<<<<< HEAD
import com.example.subway.entity.RouteEntity;
=======
import com.example.subway.entity.LineEntity;
import com.example.subway.entity.RouteEntity;
import com.example.subway.entity.StationEntity;
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RouteRepository extends JpaRepository<RouteEntity, Long> {

    @Query("SELECT r FROM RouteEntity r WHERE r.departureStation.id = :stationId OR r.arrivalStation.id = :stationId")
    List<RouteEntity> findConnectedRoutesByStationId(@Param("stationId") Long stationId);
<<<<<<< HEAD
}
=======

    @Query("SELECT r FROM RouteEntity r " +
            "WHERE (r.departureStation.id = :stationId OR r.arrivalStation.id = :stationId) " +
            "AND r.line = :line")
    List<RouteEntity> findConnectedRoutesByStationIdAndLine(@Param("stationId") Long stationId, @Param("line") String line);
}
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
