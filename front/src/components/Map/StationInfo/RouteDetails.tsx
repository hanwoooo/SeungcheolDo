import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '@/constants';
import InsideStationButton from './InsideStationButton';
import { getLineColor } from '@/types/domain';

interface RouteDetailsProps {
  route: {
    line: string;
    path: string[];
    timeValue: number;
  };
  index: number;
  expandedIndexes: number[];
  toggleAccordion: (index: number) => void;
}

function RouteDetails({ route, index, expandedIndexes, toggleAccordion }: RouteDetailsProps) {
  return (

    <View key={index} style={styles.route}>
      <View style={styles.lineRouteBar}>
        <Text style={[styles.lineNumber, { borderColor: getLineColor(route.line) }]}>
          {route.line}
        </Text>
        <View style={[styles.routeBar, { backgroundColor: getLineColor(route.line) }]}>
        </View>
      </View>
      <View style={styles.routeContainer}>
        <View style={styles.lineContainer}>
          <Text style={styles.line}>{route.line}호선</Text>
          <InsideStationButton stationName={route.path[0]} connectedStation={route.path[1]} line={route.line} index={index} />
        </View>
        <View style={styles.pathContainer}>
          <Text style={styles.pathInfo}>{route.path.length}개 역 이동</Text>
          <TouchableOpacity
            style={styles.accordionContainer}
            onPress={() => toggleAccordion(index)}
          >
            <Text style={styles.timeValue}>{Math.floor(route.timeValue / 60)}분 </Text>
            <Text style={styles.timeValue}>{route.timeValue % 60}초</Text>
            <MaterialIcons
              name={
                expandedIndexes.includes(index)
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              size={30}
              color={colors.BLACK}
            />
          </TouchableOpacity>
        </View>
        {expandedIndexes.includes(index) && (
          route.path.map((path, index) => (
            <Text key={index} style={styles.path}>{path}</Text>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lineRouteBar: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  route: {
    flexDirection: 'row',
    marginBottom: 50,
    width: '100%',
    alignItems: 'stretch',
  },
  lineNumber: {
    fontSize: 18,
    color: colors.BLACK,
    fontWeight: 'bold',
    position: 'absolute',
    top: 0,
    borderWidth: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.WHITE,
    textAlign: 'center',
    zIndex: 1,
  },
  routeBar: {
    width: '40%',
    flex: 1,
    borderRadius: 30,
  },
  line: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  routeContainer: {
    width: '85%',
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
  },
  pathContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.GRAY_300,
    paddingTop: 20,
    paddingBottom: 20,
  },
  path: {
    fontSize: 16,
    color: colors.BLACK,
    paddingTop: 10,
    paddingBottom: 10,
  },
  pathInfo: {
    fontSize: 16,
    color: colors.BLACK,
    marginRight: 10,
  },
  timeValue: {
    fontSize: 16,
    color: colors.BLACK,
    fontWeight: 'bold',
  },
  accordionContainer: {
    flexDirection: 'row',
  },
});

export default RouteDetails; 