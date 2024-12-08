package com.example.subway.algorithm;

import java.util.Map;

public class ForGetPath {
    Map<Integer, RouteValue> value;
    RouteValue current;
    public ForGetPath(Map<Integer, RouteValue> value, RouteValue current){
        this.value = value;
        this.current = current;
    }
}
