import { createDrawerNavigator } from "@react-navigation/drawer"
import BookMarkScreen from "@/screens/bookMark/BookMarkScreen";
import MapStackNavigator, { MapStackParamList } from "../stack/MapStackNavigator";
import { colors, mainNavigations } from "@/constants";
import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Dimensions } from "react-native";
import CustomDrawerContent from "./CustomDrawerContent";
import StationInfo from "@/screens/map/StationInfo";

export type MainDrawerParamList = {
  [mainNavigations.HOME]: NavigatorScreenParams<MapStackParamList>;
  [mainNavigations.BOOK_MARK]: undefined;
  [mainNavigations.STATION]: undefined;
};

const Drawer = createDrawerNavigator<MainDrawerParamList>();

function DrawerIcons(route: RouteProp<MainDrawerParamList>, focused: boolean) {
  let iconName = '';

  switch (route.name) {
    case mainNavigations.HOME: {
      iconName = 'location-on';
      break;
    }
    case mainNavigations.BOOK_MARK: {
      iconName = 'star';
      break;
    }
    case mainNavigations.STATION: {
      iconName = 'subway';
      break;
    }
  }

  return <MaterialIcons name={iconName} size={20} color={focused ? colors.WHITE : colors.GRAY_500} />
}

function MainDrawerNavigator() {

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: Dimensions.get('screen').width * 0.7,
          backgroundColor: colors.WHITE,
        },
        drawerActiveTintColor: colors.BLACK,
        drawerInactiveTintColor: colors.GRAY_500,
        drawerActiveBackgroundColor: colors.BLUE_200,
        drawerInactiveBackgroundColor: colors.GRAY_100,
        drawerLabelStyle: {
          fontWeight: '600',
        },
        drawerIcon: ({ focused }) => DrawerIcons(route, focused),
      })}>
      <Drawer.Screen
        name="Home"
        component={MapStackNavigator}
        options={{
          title: '홈',
        }}
      />
      <Drawer.Screen
        name="BookMark"
        component={BookMarkScreen}
        options={{
          title: '즐겨찾기',
        }}
      />
      <Drawer.Screen
        name="Station"
        component={StationInfo}
        options={{
          title: '역검색',
        }}
      />
    </Drawer.Navigator>
  )
}

export default MainDrawerNavigator;