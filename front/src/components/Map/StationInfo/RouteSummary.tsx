import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants';

interface RouteSummaryProps {
  time: number;
  distance: number;
  cost: number;
}

function RouteSummary({ time, distance, cost }: RouteSummaryProps) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return (
    <View style={styles.summary}>
      <View style={styles.summaryItem}>
        {hours > 0 && (
          <>
            <Text style={styles.time}>{hours}</Text>
            <Text style={styles.timeUnit}>시간</Text>
          </>
        )}
        {minutes > 0 && (
          <>
            <Text style={styles.time}>{minutes}</Text>
            <Text style={styles.timeUnit}>분</Text>
          </>
        )}
        {seconds > 0 && (
          <>
            <Text style={styles.time}>{seconds}</Text>
            <Text style={styles.timeUnit}>초</Text>
          </>
        )}
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
    alignItems: 'baseline',
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
    marginRight: 5,
  },
  details: {
    fontSize: 16,
    color: colors.BLACK,
  },
});

export default RouteSummary;
