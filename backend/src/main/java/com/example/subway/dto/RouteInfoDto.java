package com.example.subway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RouteInfoDto {

    private String line;
    private String stationName;
<<<<<<< HEAD
    private String connectedStationName;
    private String exitNum;

    @JsonProperty("isTransfer")
    private boolean isTransfer;
=======
    private String exitNum;
    private String stationType; // departure, transfer, arrival
>>>>>>> 98fd4697b1b97f6c1cab97773c4812e2fc6ad1e2
}
