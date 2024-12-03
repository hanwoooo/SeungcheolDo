import { colors } from '@/constants/colors';
import { mapNavigations } from "@/constants";
// 추가
import { MapStackParamList } from "@/navigations/stack/MapStackNavigator";
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// 여기까지
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface InsideStationButtonProps {
  stationName: string;
}

type RouteProps = RouteProp<MapStackParamList, "StationSearch">;
type NavigationProp = StackNavigationProp<MapStackParamList, typeof mapNavigations.STATION_SEARCH>;

function InsideStationButton({ stationName }: InsideStationButtonProps) {
  const [selectTypes, setSelectTypes] = useState<string[]>([]);
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { selectType } = route.params;
  const index = route.params?.index;
  console.log(stationName, route);
  
  const handleButtonPress = async () => {
    // try{
    //   if selectType == 
    // }
  //   setActivePath(index); // 버튼 변경을 위함.

  //   // exitNum을 업데이트한 stationData 생성
  //   const updatedStationData = { ...stationData, exitNum: (index + 1).toString() }; // 여기서 index 별로 exitNum 변경
  //   try {
  //     const selectedPath = await postcoordsData(updatedStationData); // 이걸 서버에서 받아온 경로로 사용
  //     if (selectedPath.length > 0) {
  //       setCurrentCoordinates(selectedPath);
  //     }

  //     // 지도 내부 좌표계를 기준으로 초기 위치 계산
  //     const { x, y } = selectedPath[0];
  //     const offsetX = x - mapWidth / 2;
  //     const offsetY = y - mapHeight / 2;

  //     // currentPosition 상태 업데이트
  //     setCurrentPosition({ x: offsetY, y: offsetX });

  //     // 애니메이션 이미지의 위치 설정
  //     positionX.setValue(offsetY); // Y축은 상하
  //     positionY.setValue(offsetX); // X축은 좌우

  //     // x 좌표에 따른 초기 회전 각도 설정
  //     const initialAngle = calculateFirstangle(x, y);
  //     rotationZ.setValue(-initialAngle); // 애니메이션 이미지 각도 설정
  //     setAngleZ(-initialAngle); // 각도 업데이트
  //   } catch (error) {
  //     console.error("경로 요청 중 오류:", error);
  //   }
  };
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>{stationName}역 내부 길찾기 이동</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    color: colors.BLACK,
  },
});

export default InsideStationButton;