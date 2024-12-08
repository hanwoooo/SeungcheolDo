import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { mapNavigations } from '@/constants';
import MapHomeScreen from '@/screens/map/MapHomeScreen';
import StationSearch from '@/screens/map/StationSearch';
import StationInfo from '@/screens/map/StationInfo';
import InsideRoute from '@/screens/map/InsideRoute';

export type MapStackParamList = {
  [mapNavigations.MAP_HOME]: { 
    stationName?: string;
  };
  [mapNavigations.STATION_SEARCH]: { 
    selectType?: 'departure' | 'arrival' | 'waypoint';
    index?: number;
  };
  [mapNavigations.STATION_INFO]: { 
    selectType: 'departure' | 'arrival' | 'waypoint';
    stationName: string;
    index?: number;
  };
  [mapNavigations.INSIDE_ROUTE]: {
    line: string;
    stationName: string;
    connectedStation: string;
    insideImage: string;
    stationType: 'departure' | 'transfer' | 'arrival';
  };
};

const Stack = createStackNavigator<MapStackParamList>();

function MapStackNavigator() {

  return (
    <Stack.Navigator screenOptions={{
      cardStyle: {
        backgroundColor: 'white',
      },
      headerStyle: {
        backgroundColor: 'white',
        shadowColor: 'gray',
      },
      headerTitleStyle: {
        fontSize: 15,
      },
      headerTintColor: 'black',
    }}>
      <Stack.Screen
        name={mapNavigations.MAP_HOME}
        component={MapHomeScreen}
        options={{ 
          headerTitle: '',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name={mapNavigations.STATION_SEARCH} 
        component={StationSearch} 
        options={{ 
          headerTitle: '',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name={mapNavigations.STATION_INFO} 
        component={StationInfo} 
        options={{ 
          headerTitle: '',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name={mapNavigations.INSIDE_ROUTE} 
        component={InsideRoute} 
        options={{ 
          headerTitle: '',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default MapStackNavigator;
