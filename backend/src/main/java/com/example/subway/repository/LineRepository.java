package com.example.subway.repository;

import com.example.subway.entity.LineEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LineRepository extends JpaRepository<LineEntity, Long> {

    Optional<LineEntity> findByLineName(String lineName);
}
