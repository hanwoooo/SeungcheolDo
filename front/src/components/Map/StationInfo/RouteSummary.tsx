import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants';

interface RouteSummaryProps {
  time: number;
  distance: number;
  cost: number;
}

function RouteSummary({ time, distance, cost }: RouteSummaryProps) {
  return (
    <View style={styles.summary}>
      <View style={styles.summaryItem}>
        <Text style={styles.time}>{Math.floor(time / 60)}</Text>
        <Text style={styles.timeUnit}>분  </Text>
        <Text style={styles.time}>{time % 60}</Text>
        <Text style={styles.timeUnit}>초</Text>
      </View>
      <Text style={styles.details}>
        {distance / 1000} km | {cost}원
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
  },
  time: {
    fontSize: 35,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  timeUnit: {
    fontSize: 16,
    color: colors.BLACK,
    marginLeft: 5,
    marginTop: 17,
  },
  details: {
    fontSize: 16,
    color: colors.BLACK,
  },
});

export default RouteSummary; 