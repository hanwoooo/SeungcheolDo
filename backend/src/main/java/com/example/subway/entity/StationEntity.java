package com.example.subway.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "stations")
public class StationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가하는 기본 키
    private Long id;

    @Column
    private String stationName;
}