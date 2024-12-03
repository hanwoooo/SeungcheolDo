import React, { ForwardedRef, forwardRef, useRef } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../constants';
import { mergeRefs } from '../utils';

interface InputFieldProps extends TextInputProps {
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}
// 텍스트 인풋에 들어있는 프랍들을 다 사용할 수 있고 disabled나 error등등을 추가하여 인풋필드로써 사용한다는 의미

const deviceHeight = Dimensions.get('screen').height;

const InputField = forwardRef(
  (
    { disabled = false, error, touched, ...props }: InputFieldProps, ref?: ForwardedRef<TextInput>,
  ) => {
    // 인풋필드의 매개변수에 들어간 내용의 의미는 내가 정의한 프랍들을 따로 지정해줘야 사용가능/ diabled = false처럼 ㅇㅇ, 그리고 나머지 기존 텍스트인풋에서 받아온 프랍들은 ...props로 다 퉁치기. 그리고 뒤에 인풋필드프랍은 그를 사용한다는 의미
    const innerRef = useRef<TextInput | null>(null);

    const handlePressInput = () => {
      innerRef.current?.focus();
    };

    return (
      <Pressable onPress={handlePressInput}>
        <View
          style={[
            styles.container,
            disabled && styles.disabled,
            touched && Boolean(error) && styles.inputError,
          ]}>
          <TextInput
            ref={ref ? mergeRefs(innerRef, ref) : innerRef}
            editable={!disabled}
            placeholderTextColor={colors.GRAY_500}
            style={[styles.input, disabled && styles.disabled]}
            autoCapitalize='none'
            spellCheck={false}
            autoCorrect={false}
            {...props}
          />
          {touched && Boolean(error) && <Text style={styles.error}>{error}</Text>}
        </View>
      </Pressable>
    );
  });

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    padding: deviceHeight > 700 ? 15 : 10,
  },
  input: {
    fontSize: 16,
    color: colors.BLACK,
    padding: 0,
  },
  disabled: {
    backgroundColor: colors.GRAY_200,
    color: colors.GRAY_700,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.RED_300,
  },
  error: {
    color: colors.RED_500,
    fontSize: 12,
    paddingTop: 5,
  },
});

export default InputField;