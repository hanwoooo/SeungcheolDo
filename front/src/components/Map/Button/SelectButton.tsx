import { colors } from '@/constants';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SelectButtonProps {
  text: string;
  size?: 'large' | 'medium';
  isSelected: boolean;
  onPress: () => void;
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
