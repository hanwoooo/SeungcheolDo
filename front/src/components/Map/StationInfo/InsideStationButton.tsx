import {colors} from '@/constants/colors';
import {useAuthContext} from '@/hooks/AuthContext';
import React, {useState, useEffect} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { mapNavigations } from "@/constants";
import { MapStackParamList } from "@/navigations/stack/MapStackNavigator";
import {postInsideStationURL} from '@/api/auth';
import {InsideStationImageURL} from '@/types/domain';
import InsideRoute from '@/screens/map/InsideRoute';
import axios from 'axios';

interface InsideStationButtonProps {
  stationName: string;
  line: string;
  index: number;
}

function InsideStationButton({
  stationName,
  line,
  index,
}: InsideStationButtonProps) {
  const {result} = useAuthContext();
  // 네비게이션
  // const navigation = useNavigation();
  const handlePress = async () => {
    // 타입설정
    const stationType: 'departure' | 'arrival' | 'transfer' =
      index === 0
        ? 'departure'
        : index === (result?.valueResults.transfer || 0) + 1
        ? 'arrival'
        : 'transfer';
    if (stationType === 'transfer'){
      
    }
    // types 설정 후 서버로 데이터 전송
    try {
      const data = {
        line,
        stationName,
        stationType,
      };

      const response = await postInsideStationURL(data);

      console.log('서버 응답:', response);

      // InsideRoute 페이지로 이동
      // navigation.navigate('InsideRoute', {response.data}: InsideStationImageURL);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios 오류:', error.response?.data || error.message);
      } else {
        console.error('예상치 못한 오류:', error);
      }
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.buttonText}>{stationName}역 내부 길찾기 이동</Text>
    </TouchableOpacity>
  );
}

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
