import React, { useState, useEffect } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import SearchInput from "@/components/SearchInput";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { colors, mapNavigations } from "@/constants";
import { MapStackParamList } from "@/navigations/stack/MapStackNavigator";
import { useAuthContext } from "@/hooks/AuthContext";
import { isStation } from "@/api/auth";
import { AxiosError } from "axios";

type NavigationProp = StackNavigationProp<MapStackParamList, "StationSearch">;
type RouteProps = RouteProp<MapStackParamList, "StationSearch">;

function StationSearch() {
  const [keyword, setKeyword] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const { favorites, fetchFavorites } = useAuthContext();
  const route = useRoute<RouteProps>();
  const { selectType } = route.params;
  const index = route.params?.index;

  const handleChangeKeyword = (text: string) => {
    setKeyword(text);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleClearSearch = () => {
    setKeyword("");
    setIsSearching(false);
  };

  const handleFavoriteClick = (stationName: string) => {
    setKeyword(stationName);
    handleSearchSubmit(stationName);
  };

  const handleSearchSubmit = async (searchKeyword?: string) => {
    const searchTerm = searchKeyword || keyword.trim();
    if (!searchTerm) {
      Alert.alert("검색어를 입력하세요.");
      return;
    }

    try {
      const result = await isStation({ stationName: searchTerm });
      if (selectType && result && index !== undefined) {
        navigation.navigate(mapNavigations.STATION_INFO, { selectType, stationName: result.stationName, index });
      } else if (selectType && result) {
        navigation.navigate(mapNavigations.STATION_INFO, { selectType, stationName: result.stationName });
      } else if (result) {
        navigation.navigate(mapNavigations.MAP_HOME, { stationName: result.stationName });
      } else {
        throw new Error("Station not found");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const status = error.response.status;

          if (status === 400) {
            Alert.alert('잘못된 요청입니다.', '검색 역이 없습니다.');
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
    } finally {
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <SearchInput
          value={keyword}
          onChangeText={handleChangeKeyword}
          placeholder="검색할 역을 입력하세요"
          onSubmit={() => handleSearchSubmit()}
          onClear={handleClearSearch}
        />
      </View>
      <View style={styles.favoriteListContainer}>
        <Text style={styles.favoriteTitle}>즐겨찾기</Text>
        {favorites.map((station) => (
          <TouchableOpacity
            key={station.stationName}
            style={styles.favoriteItem}
            onPress={() => handleFavoriteClick(station.stationName)}
          >
            <Text style={styles.favoriteText}>{station.stationName}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchInputContainer: {
    marginTop: 40,
    margin: 20,
  },
  favoriteListContainer: {
    marginTop: 20,
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: colors.GRAY_200,
    marginVertical: 10,
    paddingVertical: 5,
  },
  favoriteItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical:10,
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.GRAY_300,
    backgroundColor: colors.WHITE,
  },
  favoriteText: {
    fontSize: 20,
    color: colors.BLACK,
  },
});

export default StationSearch;
