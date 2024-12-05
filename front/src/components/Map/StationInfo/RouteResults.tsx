import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useAuthContext } from '@/hooks/AuthContext';
import { colors } from '@/constants';
import RouteBar from './RouteBar';
import RouteSummary from './RouteSummary';
import RouteDetails from './RouteDetails';
import { getLineColor } from '@/types/domain';
import InsideStationButton from './InsideStationButton';

function RouteResults() {
  const { result, arrival } = useAuthContext();
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter((i) => i !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  };

  const renderRouteBars = () => {
    if (!result) return null;

    let accumulatedTime = 0;
    return result.routeResults.map((route, index) => {
      const barWidth = (route.timeValue / result.valueResults.time) * 100;
      const currentLeft = (accumulatedTime / result.valueResults.time) * 100;
      const routeColor = getLineColor(route.line);
      accumulatedTime += route.timeValue;

      return (
        <RouteBar
          key={index}
          route={route}
          barWidth={barWidth}
          currentLeft={currentLeft}
          routeColor={routeColor}
        />
      );
    });
  };

  if (!result) {
    return (
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/크레파스로고.png')} style={styles.logo} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <RouteSummary
        time={result.valueResults.time}
        distance={result.valueResults.distance}
        cost={result.valueResults.cost}
      />
      <View style={styles.routeBarContainer}>
        {renderRouteBars()}
      </View>

      <View style={styles.routes}>

        {result.routeResults.map((route, index) => (
          <RouteDetails
            key={index}
            route={route}
            index={index}
            expandedIndexes={expandedIndexes}
            toggleAccordion={toggleAccordion}
          />
        ))}
      </View>
      <View style={{
        height: 700, flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <Text style={{ color: colors.WHITE }}>도착 역 내부경로버튼 라인</Text>
        <InsideStationButton stationName={arrival} connectedStation={result.routeResults[result.routeResults.length - 1].path[result.routeResults[result.routeResults.length - 1].path.length - 2]} line={result.routeResults[result.routeResults.length - 1].line} index={999} />
        {/*도착역이란걸 표시하기 위해 999 사용*/}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  routeBarContainer: {
    position: 'relative',
    height: 30,
    marginBottom: 30,
    flexDirection: 'row',
  },
  container: {
    padding: 20,
    backgroundColor: colors.WHITE,
    width: '95%',
    alignSelf: 'center',
  },
  routes: {
    borderTopWidth: 1,
    borderTopColor: colors.GRAY_300,
    paddingTop: 10,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 430,
    height: 200,
  },
});

export default RouteResults;
