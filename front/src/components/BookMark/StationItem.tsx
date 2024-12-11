import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '@/constants';
import BookMark from '@/components/BookMark/BookMark';

interface StationItemProps {
  stationName: string;
  isFavorite?: boolean;
  medium?: boolean;
  onAddFavorite?: () => void;
  onRemoveFavorite?: () => void;
}

function StationItem({
  stationName,
  isFavorite = false,
  medium,
  onAddFavorite,
  onRemoveFavorite,
}: StationItemProps) {
  const handleToggleFavorite = () => {
    if (isFavorite) {
      onRemoveFavorite && onRemoveFavorite();
    } else {
      onAddFavorite && onAddFavorite();
    }
  };

  return (
    <View style={medium === true ? styles.mediumContainer : styles.container}>
      <Text style={styles.stationName}>{stationName}</Text>
      <BookMark
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: colors.GRAY_500,
    borderRadius: 20,
  },
  mediumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: colors.GRAY_500,
    borderRadius: 20,
  },
  stationName: {
    fontSize: 23,
    color: colors.BLACK,
  },
});

export default StationItem;
