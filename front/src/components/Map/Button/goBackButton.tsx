import React from "react";
import { StyleSheet, Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StackNavigationProp } from "@react-navigation/stack";
import { colors } from "@/constants";
import { MapStackParamList } from "@/navigations/stack/MapStackNavigator";
import { MainDrawerParamList } from "@/navigations/drawer/MainDrawerNavigator";

type Navigation = CompositeNavigationProp<
  StackNavigationProp<MapStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

function GoBackButton() {
  const navigation = useNavigation<Navigation>();

  return (
    <>
      <Pressable
        style={styles.goBackButton}
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.openDrawer();
          }
        }}
      >
        <Ionicons name="chevron-back" size={40} color={colors.BLUE_700} />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  goBackButton: {
    position: "absolute",
    left: 10,
    width: 40,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.WHITE,
  },
});

export default GoBackButton;
