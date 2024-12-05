import RouteResults from "@/components/Map/StationInfo/RouteResults";
import RouteStation from "@/components/Map/StationInfo/RouteStation";
import { StyleSheet, View } from "react-native";

function StationInfo() {
  return (
    <View style={styles.container}>
      <RouteStation />
      <RouteResults />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default StationInfo;

