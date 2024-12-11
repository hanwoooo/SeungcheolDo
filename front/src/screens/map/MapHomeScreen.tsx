import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapScreen from '@/components/Map/MapHomeScreen/MapScreen';
import SearchButton from '@/components/Map/Button/SearchButton';
import { useRoute, RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { MapStackParamList } from '@/navigations/stack/MapStackNavigator';
import { searchStation } from '@/api/auth';
import { StationData } from '@/types/domain';
import { colors, mapNavigations } from '@/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import StationBottomSheet from '@/components/Map/MapHomeScreen/StationBottomSheet';

type RouteProps = RouteProp<MapStackParamList, typeof mapNavigations.MAP_HOME>;
type NavigationProp = StackNavigationProp<MapStackParamList, typeof mapNavigations.MAP_HOME>;

function MapHomeScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();

  const [selectedStationName, setSelectedStationName] = useState<string>(
    route.params?.stationName || ''
  );
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [currentLine, setCurrentLine] = useState<string | null>(null);
  const bottomSheetRef = React.useRef(null);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.stationName) {
        setSelectedStationName(route.params.stationName);
      }
    }, [route.params?.stationName])
  );

  useEffect(() => {
    const fetchStationData = async () => {
      if (selectedStationName) {
        try {
          const data = await searchStation({ stationName: selectedStationName });
          setStationData(data || null);
          if (data?.connectedStations && data.connectedStations.length > 0) {
            setCurrentLine(data.connectedStations[0].line);
          }
        } catch (error) {
          console.error('Failed to fetch station data:', error);
        }
      }
    };

    fetchStationData();
  }, [selectedStationName]);

  const onSelectStation = (type: 'departure' | 'arrival', stationName: string) => {
    navigation.navigate(mapNavigations.STATION_INFO, { selectType: type, stationName });
  };

  const onStationClick = (stationName: string) => {
    setSelectedStationName(stationName);
  };

  const handleSearchPress = () => {
    navigation.navigate({
      name: mapNavigations.STATION_SEARCH,
      params: {},
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <SearchButton onPress={handleSearchPress} />
      </View>
      <MapScreen 
        onStationClick={onStationClick}
      />
      {stationData && selectedStationName && (
        <StationBottomSheet
          stationName={{ stationName: selectedStationName }}
          stationData={stationData}
          currentLine={currentLine}
          setCurrentLine={setCurrentLine}
          bottomSheetRef={bottomSheetRef}
          snapPoints={['10%', '40%', '12%']}
          selectType={null}
          onSelectStation={onSelectStation}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_100,
  },
  searchInputContainer: {
    position: "absolute",
    top: 30,
    left: 16,
    right: 16,
    zIndex: 10,
  },
});

export default MapHomeScreen;
