import { colors } from '@/constants';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// 색상 정의


interface SelectButtonProps {
  text: string; // 버튼 텍스트
  size?: 'large' | 'medium';
  isSelected: boolean; // 현재 선택 여부
  onPress: () => void; // 버튼 클릭 이벤트
}

function SelectButton({
  text,
  isSelected,
  onPress,
}: SelectButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.GRAY_500,
    paddingHorizontal: 18,
    marginHorizontal: 10,
    width: '50%',
    paddingVertical: 10,
    margin: 5,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.BLACK,
  },
});

export default SelectButton;
