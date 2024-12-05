import { postInsideStationURL } from '@/api/auth';
import { colors } from '@/constants/colors';
import { useAuthContext } from '@/hooks/AuthContext';
import { MapStackParamList } from '@/navigations/stack/MapStackNavigator';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface InsideStationButtonProps {
  stationName: string;
  connectedStation: string;
  line: string;
  index: number;
}

type NavigationProp = StackNavigationProp<MapStackParamList, "StationInfo">;
function InsideStationButton({ stationName, connectedStation, line, index }: InsideStationButtonProps) {
  const navigation = useNavigation<NavigationProp>();
  const { setInsideImage, setStationType } = useAuthContext();
  const handlePress = async () => {
    let stationType: 'departure' | 'transfer' | 'arrival';
    if (!(index === 999)) {
      stationType = index === 0 ? 'departure' : 'transfer';
    } else {
      stationType = 'arrival';
    }
    console.log("스테이션 이름: ", stationName, ", 스테이션 타입: ", stationType, ", 라인: ", line, ", 인덱스: ", index);
    const insideImage = await postInsideStationURL({ line, stationName, stationType });
    console.log("결과: ", insideImage);
    setInsideImage(insideImage);
    setStationType(stationType);
    console.log("연결된 역: ", connectedStation);
    navigation.navigate("InsideRoute", { line, stationName, connectedStation, insideImage, stationType });
  };
  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
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