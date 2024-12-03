package com.example.subway.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "station_exit_coordinates")
public class StationExitCoordinateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "exit_id", referencedColumnName = "id")
    private StationExitEntity stationExit;

    @Column
    private String coordinates; // "19,20/31,123"
}
