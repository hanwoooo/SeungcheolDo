package com.example.subway.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "transfer_station_coordinates")
public class TransferStationCoordinateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가하는 기본 키
    private Long id;

    @ManyToOne
    @JoinColumn(name = "station_dir_id", referencedColumnName = "id")
    private StationDirectionEntity stationDirection;

    @Column
    private String coordinates;

}
