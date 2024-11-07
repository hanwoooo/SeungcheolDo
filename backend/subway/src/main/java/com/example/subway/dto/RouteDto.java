package com.example.subway.dto;

import com.example.subway.entity.RouteEntity;
import com.example.subway.entity.StationEntity;
import lombok.Data;

import java.util.List;

@Data
public class RouteDto {

    private Long id;
    private Long departureStationId;
    private Long arrivalStationId;
    private List<Long> pathStationId;
    private int time;
    private int distance;
    private int cost;

    public static RouteDto toRouteDTO(RouteEntity routeEntity) {
        RouteDto routeDTO = new RouteDto();
        routeDTO.setId(routeEntity.getId());
        routeDTO.setDepartureStationId(routeEntity.getDepartureStation().getId());
        routeDTO.setArrivalStationId(routeEntity.getArrivalStation().getId());
        routeDTO.setTime(routeEntity.getTime());
        routeDTO.setDistance(routeEntity.getDistance());
        routeDTO.setCost(routeEntity.getCost());
        return routeDTO;
    }
}
