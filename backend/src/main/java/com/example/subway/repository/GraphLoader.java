package com.example.subway.repository;

import com.example.subway.algorithm.Graph;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class GraphLoader {

    private Graph graph;

    public GraphLoader(Graph graph) {
        this.graph = graph;
    }

    public void loadGraphData() {
        try (Connection connection = DatabaseConnector.getConnection();
             Statement statement = connection.createStatement()) {

            // 역 데이터 가져오기
            String stationQuery = "SELECT * FROM stations";
            ResultSet stationResultSet = statement.executeQuery(stationQuery);
            while (stationResultSet.next()) {
                int stationId = stationResultSet.getInt("id");
                String stationName = stationResultSet.getString("station_name");
                graph.addStation(stationId, stationName);  // addStation 메서드를 추가해서 역을 그래프에 저장
            }

            // 경로 데이터 가져오기
            String routeQuery = "SELECT * FROM routes";
            ResultSet routeResultSet = statement.executeQuery(routeQuery);
            while (routeResultSet.next()) {
                int departureId = routeResultSet.getInt("departure_station_id");
                int arrivalId = routeResultSet.getInt("arrival_station_id");
                int time = routeResultSet.getInt("time");
                int distance = routeResultSet.getInt("distance");
                int cost = routeResultSet.getInt("cost");
                int line = routeResultSet.getInt("line"); // 호선 정보

                // Graph 객체에 Edge 추가
                graph.addEdge(departureId, arrivalId, time, distance, cost, line);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
