package com.example.subway.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "station_exits")
public class StationExitEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "station_dir_id", referencedColumnName = "id")
    private StationDirectionEntity stationDirection;

    @Column
    private String exitNumber;
}
