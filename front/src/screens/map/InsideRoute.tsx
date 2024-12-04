import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import Svg, {Polyline} from 'react-native-svg';
import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {postCoordsData} from '@/api/auth';
import {CoordsData, InsideStationCoordinates} from '@/types/domain';
import {useAuthContext} from '@/hooks/AuthContext';
import {MapStackParamList} from '@/navigations/stack/MapStackNavigator';
import {RouteProp, useRoute} from '@react-navigation/native';

type RouteProps = RouteProp<MapStackParamList, 'InsideRoute'>;

const {width, height} = Dimensions.get('window');
const mapWidth = 277;
const mapHeight = 370;

const STEP_LENGTH = 0.7; // 한 걸음당 이동 거리 (단위: 미터)
const THRESHOLD = 1.2; // 걸음 감지 임계값 (가속도 합성값 기준)

interface Position {
  x: number;
  y: number;
}

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

interface GyroscopeData {
  x: number;
  y: number;
  z: number;
}

// 칼만 필터 클래스
class KalmanFilter {
  private p: number; // 과정 잡음 (모델의 예측 신뢰도)
  private m: number; // 측정 잡음 (센서의 신뢰도)
  private e: number; // 추정 오차 공분산
  private i: number; // 초기 추정 값
  private k: number; // 칼만 이득

  constructor(
    processNoise: number,
    measurementNoise: number,
    estimateError: number,
    initialValue: number,
  ) {
    this.p = processNoise;
    this.m = measurementNoise;
    this.e = estimateError;
    this.i = initialValue;
    this.k = 0;
  }

  update(measurement: number): number {
    // 예측 단계
    this.e = this.e + this.p;

    // 칼만 이득 계산
    this.k = this.e / (this.e + this.m);

    // 추정값 업데이트
    this.i = this.i + this.k * (measurement - this.i);

    // 추정 오차 공분산 업데이트
    this.e = (1 - this.k) * this.e;

    return this.i;
  }
}

const coordsData = async (stationInfo: InsideStationCoordinates) => {
  try {
    // postCoordsData 호출
    const response = await postCoordsData(stationInfo);

    // 서버 응답 데이터 확인
    console.log('서버 응답 데이터:', response, typeof(response));

    const result: {x: number; y: number}[] = [];
    // 응답 데이터를 '/'로 분리
    const array = String(response).split('/');
    console.log(array);
    array.forEach(coords => {
      if (coords.trim()) {
        const xy = coords.split(',').map(val => parseFloat(val.trim()));
        if (xy.length === 2 && !isNaN(xy[0]) && !isNaN(xy[1])) {
          result.push({x: xy[0], y: xy[1]});
        } else {
          console.warn('유효하지 않은 좌표:', coords);
        }
      }
    });
    if (stationInfo.stationType === 'arrival') {
      result.reverse(); // 도착이면 개찰구에서 출구로 가는 방향으로 길 안내
    }

    // 변환된 데이터 확인
    console.log('변환된 좌표 데이터:', result[0]);
    return result;
  } catch (error) {
    console.error('POST 요청 중 오류:', error);
    return [];
  }
};

function InsideRoute() {
  const [currentCoordinates, setCurrentCoordinates] = useState<
    {x: number; y: number}[]
  >([]); // 선택된 경로 좌표 state -- 서버에서 받으면 변경
  const [activePath, setActivePath] = useState<number | null>(null); // 활성화된 경로 state
  const [currentPosition, setCurrentPosition] = useState<Position>({
    x: 0,
    y: 0,
  }); // 현재 위치 state
  const [lastMagnitude, setLastMagnitude] = useState<number>(0); // 합성가속도 값 state
  const [angleZ, setAngleZ] = useState<number>(0); // 각도 state
  const route = useRoute<RouteProps>();
  const {line, stationName, insideImage, stationType} = route.params;
  // stationInfo 객체 정의
  const stationInfo: InsideStationCoordinates = {
    line,
    stationName,
    stationType,
    exitNum: '',
    // 필요에 따라 추가 필드들 추가
  };
  // 애니메이션 값
  const positionX = useRef<Animated.Value>(new Animated.Value(0)).current;
  const positionY = useRef<Animated.Value>(new Animated.Value(0)).current;
  const rotationZ = useRef<Animated.Value>(new Animated.Value(0)).current;

  // 칼만 필터 인스턴스 생성
  const kalman = useRef(new KalmanFilter(0.01, 0.1, 1, 0)).current;

  // 초기위치 각도지정 함수
  const calculateFirstangle = (x: number, y: number): number => {
    if (x >= 0 && x < 40) return 90; // 0 ~ 20: 90도
    if (x >= 40 && x < 230) {
      if (y >= 0 && y < 40) {
        return 180;
      }
      return 0; // 20 ~ 200: 0도
    }
    if (x >= 230 && x <= 277) return -90;
    return 0; // 기본값
  };

  // 버튼 선택 시 작동 함수
  const routeButtonPress = async (index: number) => {
    setActivePath(index); // 버튼 변경을 위함.

    // exitNum을 업데이트한 stationData 생성
    const updatedStationData = {
      ...stationInfo,
      exitNum: (index + 1).toString(),
    }; // 여기서 index 별로 exitNum 변경
    try {
      const selectedPath = await coordsData(updatedStationData);
      if (selectedPath.length > 0) {
        setCurrentCoordinates(selectedPath);
      }

      // 지도 내부 좌표계를 기준으로 초기 위치 계산
      const {x, y} = selectedPath[0];
      console.log(x,y);
      const offsetX = x - mapWidth / 2;
      const offsetY = y - mapHeight / 2;

      // currentPosition 상태 업데이트
      setCurrentPosition({x: offsetY, y: offsetX});

      // 애니메이션 이미지의 위치 설정
      positionX.setValue(offsetY); // Y축은 상하
      positionY.setValue(offsetX); // X축은 좌우

      // x 좌표에 따른 초기 회전 각도 설정
      const initialAngle = calculateFirstangle(x, y);
      rotationZ.setValue(-initialAngle); // 애니메이션 이미지 각도 설정
      setAngleZ(-initialAngle); // 각도 업데이트
    } catch (error) {
      console.error('경로 요청 중 오류:', error);
    }
  };
  // 버튼 선택 시 작동 함수
  const handleButtonPress = async () => {
    try {
      const selectedPath = await coordsData(stationInfo); // 이걸 서버에서 받아온 경로로 사용
      if (selectedPath.length > 0) {
        setCurrentCoordinates(selectedPath);
      }

      // 지도 내부 좌표계를 기준으로 초기 위치 계산
      const {x, y} = selectedPath[0];
      const offsetX = x - mapWidth / 2;
      const offsetY = y - mapHeight / 2;

      // currentPosition 상태 업데이트
      setCurrentPosition({x: offsetY, y: offsetX});

      // 애니메이션 이미지의 위치 설정
      positionX.setValue(offsetY); // Y축은 상하
      positionY.setValue(offsetX); // X축은 좌우

      // x 좌표에 따른 초기 회전 각도 설정
      const initialAngle = calculateFirstangle(x, y);
      rotationZ.setValue(-initialAngle); // 애니메이션 이미지 각도 설정
      setAngleZ(-initialAngle); // 각도 업데이트
    } catch (error) {
      console.error('경로 요청 중 오류:', error);
    }
  };

  useEffect(() => {
    // 가속도계와 자이로스코프 데이터 리스너 설정
    setUpdateIntervalForType(SensorTypes.accelerometer, 100); // 가속도계 업데이트 간격 설정
    setUpdateIntervalForType(SensorTypes.gyroscope, 100); // 자이로스코프 업데이트 간격 설정

    const accelSubscription = accelerometer.subscribe(
      ({x, y, z}: AccelerometerData) => {
        const magnitude = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

        // 걸음 감지 (상승 모멘트만 인식)
        if (magnitude > THRESHOLD && lastMagnitude <= THRESHOLD) {
          const filteredAngle = isNaN(kalman.update(angleZ))
            ? 0
            : kalman.update(angleZ);

          const radian = (filteredAngle * Math.PI) / 180;
          const dx = -STEP_LENGTH * Math.cos(radian) * 25;
          const dy = -STEP_LENGTH * Math.sin(radian) * 20;

          const newPosition = {
            x: currentPosition.x + (isNaN(dx) ? 0 : dx),
            y: currentPosition.y + (isNaN(dy) ? 0 : dy),
          };

          setCurrentPosition(newPosition);

          // 애니메이션 실행
          Animated.spring(positionX, {
            toValue: newPosition.x,
            useNativeDriver: true,
          }).start();

          Animated.spring(positionY, {
            toValue: newPosition.y,
            useNativeDriver: true,
          }).start();
        }

        setLastMagnitude(magnitude);
      },
    );

    const gyroSubscription = gyroscope.subscribe(({z}: GyroscopeData) => {
      const deltaAngleZ = z * 0.1 * (180 / Math.PI); // 100ms 간격 기준
      setAngleZ(prev => prev + deltaAngleZ);

      // 애니메이션 갱신 -- 안에 넣으면 애니메이션이 느려지긴 하는데 빼면 각도 조정이 안됨;;
      rotationZ.setValue(-kalman.update(angleZ));
    });

    return () => {
      accelSubscription.unsubscribe();
      gyroSubscription.unsubscribe();
    };
  }, [angleZ, lastMagnitude, currentPosition]);

  const fullImagePath = `http://192.168.0.12:8080${insideImage}`;

  return (
    <View style={styles.container}>
      {stationInfo.stationType === 'transfer' ? (
        <>
          <Text style={styles.text}>경로를 확인하려면 눌러주세요!</Text>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => handleButtonPress()}>
                <Text style={[styles.buttonText, styles.activeButtonText]}>
                  경로확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.text}>출입구를 선택해주세요!</Text>
          <View style={styles.buttonContainer}>
            {['1', '2', '3', '4'].map((label, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.circleButton,
                  activePath === index && styles.activeButton,
                ]}
                onPress={() => routeButtonPress(index)}>
                <Text
                  style={[
                    styles.buttonText,
                    activePath === index && styles.activeButtonText,
                  ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
      <View style={styles.imageContainer}>
        {/* 여기 이미지 서버에서 받으면 변경 예정 */}
        {insideImage && (
          <Image source={{uri: fullImagePath}} style={[styles.map]} />
        )}
        <Svg width={mapWidth} height={mapHeight} style={{position: 'absolute'}}>
          {activePath !== null && currentCoordinates.length > 0 && (
            <Polyline
              points={currentCoordinates.map(({x, y}) => `${x},${y}`).join(' ')}
              fill="none"
              stroke="red"
              strokeWidth="5"
            />
          )}
        </Svg>
        <Animated.Image
          source={require('../../assets/subway_person.png')}
          style={[
            styles.image,
            {
              transform: [
                {translateX: positionY},
                {translateY: positionX},
                {
                  rotateZ: rotationZ.interpolate({
                    inputRange: [-360, 360],
                    outputRange: ['-360deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    margin: 10,
  },
  imageContainer: {
    width: width,
    height: height / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: mapWidth, // 지도의 크기
    height: mapHeight,
    position: 'absolute',
  },
  image: {
    width: 20,
    height: 37,
    position: 'absolute',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 2, // 검은색 테두리
    borderColor: '#000000',
  },
  activeButton: {
    backgroundColor: '#0365C7', // 활성화 시 파란색 배경
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeButtonText: {
    color: '#FFFFFF', // 활성화 시 흰색 텍스트
  },
});

export default InsideRoute;
