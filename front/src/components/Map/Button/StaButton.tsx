import { colors } from '@/constants';
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface ButtonProps {
  text: string; // 버튼에 들어갈 텍스트
  onPress?: (event: GestureResponderEvent) => void; // 클릭 이벤트 핸들러
}

const StaButton: React.FC<ButtonProps> = ({ text, onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => setIsPressed(true); // 클릭 시작 시
  const handlePressOut = () => setIsPressed(false); // 클릭 끝날 시

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, isPressed && styles.textPressed]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.GRAY_300,
    borderRadius: 5,
    paddingVertical: 20,
    paddingHorizontal: 15,
    margin: 5,
  },
  text: {
    color: colors.BLACK,
    textAlign: 'left', // 텍스트 왼쪽 정렬
    fontSize: 16,
  },
  textPressed: {
    color: colors.GRAY_500, // 클릭 시 텍스트 색상
  },
});

export default StaButton;
