import { colors } from '@/constants/colors';
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface WaypointControlsProps {
  waypointsLength: number;
  onAdd: () => void;
  onMinus: () => void;
}

const WaypointControls: React.FC<WaypointControlsProps> = ({ waypointsLength, onAdd, onMinus }) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={[styles.button, waypointsLength >= 5 && styles.disabledButton]}
      onPress={onAdd}
      disabled={waypointsLength >= 5}
    >
      <MaterialIcons name="add" size={50} color={waypointsLength >= 5 ? colors.GRAY_300 : colors.GRAY_500} />
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.button, waypointsLength === 0 && styles.disabledButton]}
      onPress={onMinus}
      disabled={waypointsLength === 0}
    >
      <MaterialIcons name="remove" size={50} color={waypointsLength === 0 ? colors.GRAY_300 : colors.GRAY_500} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  button: {
    width: 60,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    marginLeft: 5,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default WaypointControls;
