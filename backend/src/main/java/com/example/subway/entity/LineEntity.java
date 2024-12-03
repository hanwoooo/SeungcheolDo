package com.example.subway.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "subway_lines")
public class LineEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String lineName;
}
