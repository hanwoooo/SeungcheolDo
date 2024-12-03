import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useAuthContext } from "@/hooks/AuthContext";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MapStackParamList } from "@/navigations/stack/MapStackNavigator";
import { mapNavigations } from "@/constants";
import { colors } from "@/constants";
import ButtonGroup from "@/components/Map/Button/ButtonGroup";
import StationList from "@/components/Map/StationInfo/StationList";
import WaypointControls from "@/components/Map/StationInfo/WaypointControls";

type NavigationProp = StackNavigationProp<MapStackParamList>;
type RouteProps = RouteProp<MapStackParamList, "StationInfo">;

function RouteStation() {
  const { departure, setDeparture, arrival, setArrival, waypoints, setWaypoints } = useAuthContext();
  const route = useRoute<RouteProps>();
  const { selectType = "departure", stationName = "", index } = route.params || {};
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (selectType === "departure") {
      setDeparture(stationName);
    } else if (selectType === "arrival") {
      setArrival(stationName);
    } else if (selectType === "waypoint") {
      if (index !== undefined) {
        const updatedWaypoints = [...waypoints];
        updatedWaypoints[index] = stationName;
        setWaypoints(updatedWaypoints);
      } else {
        setWaypoints([...waypoints, stationName]);
      }
    }
  }, [selectType, stationName, index]);

  const handleButtonPress = (type: "departure" | "arrival" | "waypoint", index?: number) => {
    if (type === "waypoint" && index !== undefined) {
      navigation.navigate(mapNavigations.STATION_SEARCH, { selectType: type, index });
    } else {
      navigation.navigate(mapNavigations.STATION_SEARCH, { selectType: type });
    }
  };

  const handleAdd = () => {
    if (waypoints.length < 5) {
      setWaypoints([...waypoints, '경유 역 선택']);
    }
  };

  const handleMinus = () => {
    if (waypoints.length > 0) {
      setWaypoints(waypoints.slice(0, -1));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stationListContainer}>
        <StationList
          departure={departure}
          arrival={arrival}
          waypoints={waypoints}
          onButtonPress={handleButtonPress}
        />
      </View>
      <WaypointControls waypointsLength={waypoints.length} onAdd={handleAdd} onMinus={handleMinus} />
      <ButtonGroup />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    elevation: 10,
    zIndex: 1,
  },
  stationListContainer: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginTop: 25,
  },
});

export default RouteStation;
