import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DrawerButton from './DrawerButton';
import { colors } from '@/constants/colors';


interface SearchButtonProps {
  onPress: () => void;
}

function SearchButton({ onPress }: SearchButtonProps) {
  return (
    <View style={styles.container}>
      <DrawerButton />
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <View style={styles.textContainer}>
          <Text style={styles.buttonText}>역 검색</Text>
        </View>
      </TouchableOpacity>
      <Ionicons
        name={'search'}
        color={colors.GRAY_700}
        size={40}
        style={styles.searchIcon}
      />
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
    borderColor: colors.GRAY_500,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 10,
    position: 'relative',
    overflow: 'visible',
    shadowColor: colors.BLACK,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  button: {
    flex: 1,
    marginLeft: 30,
    justifyContent: 'center',
    backgroundColor: colors.WHITE,
    paddingVertical: 30,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center', // 세로 가운데 정렬
    alignItems: 'flex-start', // 가로 왼쪽 정렬
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 18,
    color: colors.GRAY_500,
    textAlign: 'left',
  },
  searchIcon: {
    marginLeft: 10, // 버튼과 아이콘 간의 간격
  },
});

export default SearchButton;
