import { stations } from "@/types/coordinates";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import React, { useState } from "react";
import { StyleSheet, Image, View, GestureResponderEvent } from "react-native";
import CustomMarker from "./CustomMarker";
import Svg from "react-native-svg";

interface MapScreenProps {
  onStationClick: (stationName: string) => void;
}

function MapScreen({ onStationClick }: MapScreenProps) {
  const [selectedStation, setSelectedStation] = useState<{
    id: string;
    coords: [number, number];
  } | null>(null);

  const handleMapPress = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    console.log(`클릭한 위치: x=${locationX}, y=${locationY}`);

    // 클릭한 위치와 가까운 역 검색
    const clickedStation = stations.find(
      (station) =>
        Math.abs(station.coords[0] - locationX) < 20 &&
        Math.abs(station.coords[1] - locationY) < 20
    );

    if (clickedStation) {
      console.log(`감지된 역: ${clickedStation.id}`);
      setSelectedStation(clickedStation); // 클릭한 역을 마커로 설정
      onStationClick(clickedStation.id); // 선택된 역 이름 전달
    } else {
      console.log("빈 공간을 클릭했습니다."); // 빈 공간 클릭 시 마커 제거
      setSelectedStation(null);
    }
  };

  return (
    <View style={styles.container} onTouchEnd={handleMapPress}>
      <ReactNativeZoomableView
        maxZoom={2.5}
        minZoom={0.85}
        zoomStep={0.3}
        initialZoom={1}
        bindToBorders={true} // 경계를 활성화
        contentWidth={1383}
        contentHeight={982}
        style={styles.zoomableView}
      >
        <Image
          source={require("@/assets/팀프_지도.png")}
          style={styles.mapImage}
          resizeMode="contain"
        />
        <Svg
          style={styles.markerLayer}
          viewBox="0 0 1383 982"
        >
          {/* 선택된 역에만 마커 표시 */}
          {selectedStation && (
            <CustomMarker
              stationName={selectedStation.id}
              coords={selectedStation.coords}
              isVisible={true}
              onPress={() => onStationClick(selectedStation.id)} // 마커 클릭 시 호출
            />
          )}
        </Svg>
      </ReactNativeZoomableView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  zoomableView: {
    flex: 1,
  },
  mapImage: {
    width: 1383,
    height: 982,
    position: "absolute",
  },
  markerLayer: {
    position: "absolute",
    width: 1383,
    height: 982,
  },
});

export default MapScreen;
