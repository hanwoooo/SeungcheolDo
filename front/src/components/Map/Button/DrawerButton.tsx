import React from "react";
import { StyleSheet, Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { colors } from "@/constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { MapStackParamList } from "@/navigations/stack/MapStackNavigator";
import { MainDrawerParamList } from "@/navigations/drawer/MainDrawerNavigator";

// DrawerNavigationProp 타입 정의
type Navigation = CompositeNavigationProp<
  StackNavigationProp<MapStackParamList>,
  DrawerNavigationProp<MainDrawerParamList>
>;

function DrawerButton() {
  const navigation = useNavigation<Navigation>();

  return (
    <>
      <Pressable
        style={styles.drawerButton} // top 값을 고정

        onPress={() => navigation.openDrawer()} // 드로어 열기
      >
        <Ionicons name="menu" size={40} color={colors.BLUE_700} />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  drawerButton: {
    position: "absolute",
    width: 40, // 아이콘 크기와 동일하게 설정
    height: 60, // 아이콘 크기와 동일하게 설정
    justifyContent: "center", // 아이콘 중앙 정렬
    alignItems: "center", // 아이콘 중앙 정렬
    backgroundColor: colors.WHITE,
  },
});

export default DrawerButton;
