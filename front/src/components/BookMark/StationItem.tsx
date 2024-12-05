import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants";
import BookMark from "@/components/BookMark/BookMark";

interface StationItemProps {
  stationName: string;
  isFavorite?: boolean; // 즐겨찾기 여부
  onAddFavorite?: () => void; // 즐겨찾기 추가 핸들러
  onRemoveFavorite?: () => void; // 즐겨찾기 삭제 핸들러
}

const StationItem: React.FC<StationItemProps> = ({
  stationName,
  isFavorite = false,
  onAddFavorite,
  onRemoveFavorite,
}) => {
  const handleToggleFavorite = () => {
    if (isFavorite) {
      onRemoveFavorite && onRemoveFavorite();
    } else {
      onAddFavorite && onAddFavorite();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stationName}>{stationName}</Text>
      <BookMark isFavorite={isFavorite} onToggleFavorite={handleToggleFavorite} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
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
