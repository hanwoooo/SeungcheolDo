import RouteResults from "@/components/Map/StationInfo/RouteResults";
import RouteStation from "@/components/Map/StationInfo/RouteStation";
import { View } from "react-native";

function StationInfo() {
  return (
    <View>
      <RouteStation />
      <RouteResults />
    </View>
  );
}

export default StationInfo;

