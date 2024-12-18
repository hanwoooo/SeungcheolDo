package com.example.subway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RouteInfoDto {

    private String line;
    private String stationName;
    private String exitNum;
    private String stationType; // departure, transfer, arrival
}
