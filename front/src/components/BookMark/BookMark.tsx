import { colors } from "@/constants";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface BookMarkProps {
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const BookMark: React.FC<BookMarkProps> = ({ isFavorite, onToggleFavorite }) => {
  return (
    <TouchableOpacity onPress={onToggleFavorite} style={styles.container}>
      <Ionicons
        name="star"
        size={40}
        color={isFavorite ? colors.YELLOW_500 : colors.GRAY_200}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BookMark;
