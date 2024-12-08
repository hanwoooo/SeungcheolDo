import { colors } from '@/constants';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface OptionButtonProps {
  text: string;
  size?: 'large' | 'medium';
  isSelected: boolean;
  onPress: () => void;
}

function OptionButton({
  text,
  size = 'large',
  isSelected,
  onPress,
}: OptionButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[size],
        isSelected ? styles.activeButton : styles.inactiveButton,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          isSelected ? styles.activeText : styles.inactiveText,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginHorizontal: 10,
  },
  activeButton: {
    backgroundColor: colors.BLUE_500,
  },
  inactiveButton: {
    backgroundColor: colors.WHITE,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeText: {
    color: colors.WHITE,
  },
  inactiveText: {
    color: colors.BLACK,
  },
  large: {
    //
  },
  medium: {
    width: '50%',
    paddingVertical: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default OptionButton;
