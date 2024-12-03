package com.example.subway.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "routes")
public class RouteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "departure_station_id", nullable = false)
    private StationEntity departureStation;

    @ManyToOne
    @JoinColumn(name = "arrival_station_id", nullable = false)
    private StationEntity arrivalStation;

    @Column
    private int time;

    @Column
    private int distance;

    @Column
    private int cost;

    @Column
    private String line;
}
