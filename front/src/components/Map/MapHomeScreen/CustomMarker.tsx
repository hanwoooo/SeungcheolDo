import { colors } from "@/constants/colors";
import React from "react";
import { TouchableOpacity, StyleSheet, Text, View, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface CustomMarkerProps {
  stationName: string; // 마커에 표시할 역 이름
  coords: [number, number]; // 마커 위치 (x, y 좌표)
  isVisible: boolean; // 마커 표시 여부
  onPress: () => void; // 마커 클릭 시 실행될 함수
}

const CustomMarker: React.FC<CustomMarkerProps> = ({
  stationName,
  coords,
  isVisible,
  onPress,
}) => {
  if (!isVisible) return null;

  return (
    <TouchableOpacity
      style={[styles.marker, { top: coords[1] - 56, left: coords[0] - 30}]}
      onPress={onPress}
    >
      <View style={styles.markerIcon}>
        <Image source={require('@/assets/마커.png')} style={styles.markerImage} />
      </View>
      <Text style={styles.label}>{stationName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  marker: {
    position: "absolute",
    alignItems: "center",
  },
  markerIcon: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  Icon: {
    color: colors.BLACK,
    backgroundColor: colors.BLUE_200,
    borderRadius: 30,
  },
  label: {
    marginTop: 5,
    fontSize: 12,
    color: "black",
    textAlign: "center",
  },
  markerImage: {
    width: 40,
    height: 63,
  },
});

export default CustomMarker;
