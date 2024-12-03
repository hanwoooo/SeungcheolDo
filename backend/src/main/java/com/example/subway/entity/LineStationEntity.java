package com.example.subway.entity;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "line_stations")
public class LineStationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "line_id", referencedColumnName = "id")
    private LineEntity line;

    @ManyToOne
    @JoinColumn(name = "station_id", referencedColumnName = "id")
    private StationEntity station;

    @Column
    private String imagePath;
}
