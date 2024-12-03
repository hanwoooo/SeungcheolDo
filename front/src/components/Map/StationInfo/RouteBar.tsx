import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants';

interface RouteBarProps {
  route: {
    timeValue: number;
    line: string;
  };
  barWidth: number;
  currentLeft: number;
  routeColor: string;
}

function RouteBar({ route, barWidth, currentLeft, routeColor }: RouteBarProps) {
  return (
    <React.Fragment>
      <View
        style={[
          styles.routeBar,
          {
            width: `${barWidth - 3}%`,
            backgroundColor: routeColor,
            left: `${currentLeft + 3}%`,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
          <Text style={styles.routeBarTimeText}>{Math.floor(route.timeValue / 60)}분 </Text>
          <Text style={styles.routeBarTimeText}>{route.timeValue % 60}초</Text>
        </View>
      </View>
      <Text
        style={[
          styles.routeBarText,
          {
            borderColor: routeColor,
            left: `${currentLeft}%`,
          },
        ]}
      >
        {route.line}
      </Text>
      </React.Fragment>
  );
}

const styles = StyleSheet.create({
  routeBar: {
    position: 'absolute',
    height: '100%',
    borderRadius: 20,
  },
  routeBarText: {
    position: 'absolute',
    top: -5,
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 40,
    fontWeight: 'bold',
    color: colors.BLACK,
    backgroundColor: colors.WHITE,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
  },
  routeBarTimeText: {
    color: colors.WHITE,
    textAlign: 'center',
    fontWeight: 'normal',
    fontSize: 14,
  },
});

export default RouteBar; 