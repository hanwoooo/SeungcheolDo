package com.example.subway.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "station_directions")
public class StationDirectionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "line_station_id", referencedColumnName = "id")
    private LineStationEntity lineStation;

    @Column
    private String direction;
}
