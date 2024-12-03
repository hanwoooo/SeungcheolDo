import React from 'react';
import { View } from 'react-native';
import StaButton from '../Button/StaButton';

interface StationListProps {
  departure: string;
  arrival: string;
  waypoints: string[];
  onButtonPress: (type: 'departure' | 'arrival' | 'waypoint', index?: number) => void;
}

const StationList: React.FC<StationListProps> = ({ departure, arrival, waypoints, onButtonPress }) => (
  <View>
    <StaButton text={`출발역: ${departure}`} onPress={() => onButtonPress('departure')} />
    {waypoints.map((waypoint, index) => (
      <StaButton key={index} text={`경유역 ${index + 1}: ${waypoint}`} onPress={() => onButtonPress('waypoint', index)} />
    ))}
    <StaButton text={`도착역: ${arrival}`} onPress={() => onButtonPress('arrival')} />
  </View>
);

export default StationList;
