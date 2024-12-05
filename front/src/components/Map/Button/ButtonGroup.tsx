import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useAuthContext } from '@/hooks/AuthContext';
import { postRoute } from '@/api/auth';
import OptionButton from './OptionButton';
import { AxiosError } from 'axios';

function ButtonGroup() {
  const { departure, arrival, waypoints, setResult } = useAuthContext();
  const [selectedOption, setSelectedOption] = useState<'최단시간' | '최소환승' | '최저요금' | '최단거리' | null>(null);

  const handleOptionSelect = async (option: '최단시간' | '최소환승' | '최저요금' | '최단거리') => {
    console.log(`Option selected: ${option}`);
    setSelectedOption(option);
    if ((departure === '출발 역 선택') || (arrival === '도착 역 선택')) {
      Alert.alert('출발역과 도착역을 선택하세요.');
      return;
    }
    
    try {
      const data = {
        departure,
        arrival,
        option,
        waypoints,
      };
      const result = await postRoute(data);
      console.log("보낸 데이터:", data);
      setResult(result);
      console.log('Route posted successfully:', result);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const status = error.response.status;

          if (status === 400) {
            Alert.alert('잘못된 요청입니다.', '출발 역, 도착역이 제대로 되었는지 확인하세요.');
          } else {
            Alert.alert('서버 에러', `오류 코드: ${status}`);
          }
        } else {
          Alert.alert('네트워크 오류', '서버와 연결안됨');
        }
      } else {
        console.error('Error posting route:', error);
        Alert.alert('알 수 없는 오류', '예상치 못한 오류가 발생');
      }
    }
  };

  return (
    <View style={styles.container}>
      {['최단시간', '최소환승', '최저요금', '최단거리'].map((option) => (
        <OptionButton
          key={option}
          text={option}
          isSelected={selectedOption === option}
          onPress={() => handleOptionSelect(option as '최단시간' | '최소환승' | '최저요금' | '최단거리')}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
});

export default ButtonGroup;
