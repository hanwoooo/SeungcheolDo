import React from 'react';
import {StyleSheet, TextInput, TextInputProps, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {colors} from '@/constants';
import GoBackButton from './Map/Button/goBackButton';

interface SearchInputProps extends TextInputProps {
  onSubmit: () => void;
  onClear: () => void;
}

function SearchInput({onSubmit, onClear, value, ...props}: SearchInputProps) {
  return (
    <View style={styles.container}>
      <GoBackButton />
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        placeholderTextColor={colors.GRAY_500}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        clearButtonMode="while-editing"
        {...props}
      />
      {value && value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={24} color={colors.GRAY_700} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.BLACK,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    position: "relative",
    overflow: 'visible',
  },
  input: {
    flex: 1,
    fontSize: 18,
    marginLeft: 30,
    color: colors.BLACK,
  },
  clearButton: {
    marginLeft: 10, // 텍스트 입력 필드와의 간격
  },
});

export default SearchInput;