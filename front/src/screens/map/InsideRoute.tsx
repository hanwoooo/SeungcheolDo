import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
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
import {InsideStationCoordinates} from '@/types/domain';
import {MapStackParamList} from '@/navigations/stack/MapStackNavigator';
import {RouteProp, useRoute} from '@react-navigation/native';
import GoBackButton from '@/components/Map/Button/goBackButton';

type RouteProps = RouteProp<MapStackParamList, 'InsideRoute'>;

const ZOOM = 1.3; // 사진의 배율
const STEP_LENGTH = 0.7; // 한 걸음당 이동 거리 (단위: 미터)
const THRESHOLD = 1.05; // 걸음 감지 임계값 (가속도 합성값 기준)

const mapWidth = 280 * ZOOM;
const mapHeight = 370 * ZOOM;

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
    console.log('서버 응답 데이터:', response, typeof response);

    const result: {x: number; y: number}[] = [];
    // 응답 데이터를 '/'로 분리
    const array = response.split('/');
    array.forEach(coords => {
      if (coords.trim()) {
        const xy = coords.split(',').map(val => parseFloat(val.trim()));
        if (xy.length === 2 && !isNaN(xy[0]) && !isNaN(xy[1])) {
          result.push({x: xy[0] * ZOOM, y: xy[1] * ZOOM});
        } else {
          console.warn('유효하지 않은 좌표:', coords);
        }
      }
    });
    if (stationInfo.stationType === 'arrival') {
      result.reverse(); // 도착이면 개찰구에서 출구로 가는 방향으로 길 안내
    }
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
  const {line, stationName, insideImage, stationType, connectedStation} =
    route.params;
  // stationInfo 객체 정의
  const stationInfo: InsideStationCoordinates = {
    line,
    stationName,
    stationType,
    exitNum: '',
    connectedStation,
  };
  // 애니메이션 값
  const positionX = useRef<Animated.Value>(new Animated.Value(0)).current;
  const positionY = useRef<Animated.Value>(new Animated.Value(0)).current;
  const rotationZ = useRef<Animated.Value>(new Animated.Value(0)).current;

  // 칼만 필터 인스턴스 생성
  const kalman = useRef(new KalmanFilter(0.01, 0.1, 1, 0)).current;

  // 초기위치 각도지정 함수
  const calculateFirstangle = (x: number, y: number): number => {
    const changeX = Math.round(x / ZOOM);
    const changeY = Math.round(y / ZOOM);
    console.log(changeX, changeY);
    // 출발 역
    if (stationInfo.stationType === 'departure') {
      if (changeX >= 25 && changeX <= 35) return 90; // 왼쪽 아래 왼쪽 & 왼쪽 위 왼쪽
      if (
        (changeX >= 48 && changeX <= 105) ||
        (changeX >= 176 && changeX <= 238)
      ) {
        if (changeY >= 335 && changeY <= 342) {
          return 0;
        }
      }
      if (
        (changeX >= 68 && changeX <= 69) ||
        (changeX >= 135 && changeX <= 240)
      ) {
        if (changeY >= 25 && changeY <= 35) return 180; //왼쪽 아래 아래 & 오른쪽 아래 아래
      }
      if (changeX >= 238 && changeX <= 252) {
        return -90; // 오른쪽 위쪽 오른쪽 & 오른쪽 아래 오른쪽
      }
      if (changeY >= 25 && changeY <= 35) return 180;
    } else if (stationInfo.stationType === 'transfer') {
      if (changeX === 40 || changeX === 175) return 90;
      if (changeX === 99 || changeX === 241) return -90;
    } else {
      if (changeX > 50 && changeX < 110) return 90;
      if (changeX >= 160 && changeX < 220) return -90;
    }
    return 0; // 기본값
  };

  // 버튼 선택 시 작동 함수
  const routeButtonPress = async (index: number) => {
    let updatedStationData = stationInfo;
    if (index !== 99) {// 99는 환승역
      setActivePath(index); // 버튼 변경을 위함.

      // exitNum을 업데이트한 stationData 생성
      updatedStationData = {
        ...stationInfo,
        exitNum: (index + 1).toString(),
      }; // 여기서 index 별로 exitNum 변경
    }

    try {
      const selectedPath = await coordsData(updatedStationData);
      if (selectedPath.length > 0) {
        setCurrentCoordinates(selectedPath);
      }

      const {x, y} = selectedPath[0];
      // 지도 내부 좌표계를 기준으로 초기 위치 계산
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
      console.log(initialAngle);
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
        const magnitude = Math.sqrt(x ** 2 + y ** 2 + z ** 2) / 10;
        // 걸음 감지 (상승 모멘트만 인식)
        if (magnitude > THRESHOLD && lastMagnitude <= THRESHOLD) {
          console.log(magnitude, lastMagnitude);
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
          console.log(newPosition);

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
      const deltaAngleZ = z * 0.13 * (180 / Math.PI); // 100ms 간격 기준
      setAngleZ(prev => prev + deltaAngleZ);
      // 애니메이션 갱신 -- 안에 넣으면 애니메이션이 느려지긴 하는데 빼면 각도 조정이 안됨;;
      rotationZ.setValue(-kalman.update(angleZ));
    });

    return () => {
      accelSubscription.unsubscribe();
      gyroSubscription.unsubscribe();
    };
  }, [angleZ, lastMagnitude, currentPosition]);

  const fullImagePath = `http://192.168.0.7:8080${insideImage}`;

  return (
    <View style={styles.container}>
      <View style={styles.goBackButton}>
        <GoBackButton />
      </View>
      {stationInfo.stationType === 'transfer' ? (
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.circleButton]}
              onPress={() => routeButtonPress(99)}>
              <Text style={styles.buttonText}>경로 확인</Text>
            </TouchableOpacity>
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
        {insideImage && (
          <Image source={{uri: fullImagePath}} style={[styles.map]} />
        )}
        <Svg width={mapWidth} height={mapHeight} style={{position: 'absolute'}}>
          {currentCoordinates.length > 0 && (
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
    padding: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center', // 이미지를 화면 중앙에 배치
    alignItems: 'center', // 이미지를 화면 중앙에 배치
  },
  goBackButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  text: {
    fontSize: 18,
    marginTop: 80,
    textAlign: 'center',
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
    marginTop: 50,
    marginBottom: -80,
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