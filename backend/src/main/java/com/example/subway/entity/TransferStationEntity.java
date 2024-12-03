package com.example.subway.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;


@Entity
@Table(name = "transfer_stations")
@Data
public class TransferStationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "line_station_id", referencedColumnName = "id")
    private LineStationEntity lineStation;

    @Column
    private String imagePath;
}
