import { colors } from '@/constants/colors';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface InsideStationButtonProps {
  stationName: string;
}

function InsideStationButton({ stationName }: InsideStationButtonProps) {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>{stationName}역 내부 길찾기 이동</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    color: colors.BLACK,
  },
});

export default InsideStationButton;