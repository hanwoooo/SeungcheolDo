import { colors } from '@/constants';
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface ButtonProps {
  text: string;
  onPress?: (event: GestureResponderEvent) => void;
}

function StaButton({ text, onPress }: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => setIsPressed(true);
  const handlePressOut = () => setIsPressed(false);

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
    textAlign: 'left',
    fontSize: 16,
  },
  textPressed: {
    color: colors.GRAY_500,
  },
});

export default StaButton;
