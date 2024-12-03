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
import { mapNavigations } from "@/constants";
import { MapStackParamList } from "@/navigations/stack/MapStackNavigator";
import { useAuthContext } from "@/hooks/AuthContext";
import { isStation } from "@/api/auth"; // 주석 처리
//import { getMockStationList } from '@/mocks/mockStationData'; // mock 데이터 사용

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
      const result = await isStation({ stationName: searchTerm }); // 주석 처리
      //const result = getMockStationList().find(station => station.stationName === searchTerm); // mock 데이터 사용
      if (selectType && result && index !== undefined) {
        navigation.navigate(mapNavigations.STATION_INFO, { selectType, stationName: result.stationName, index });
      }else if (selectType && result) {
        navigation.navigate(mapNavigations.STATION_INFO, { selectType, stationName: result.stationName });
      } else if (result) {
        navigation.navigate(mapNavigations.MAP_HOME, { stationName: result.stationName });
      } else {
        throw new Error("Station not found");
      }
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      Alert.alert("검색 실패", "역 정보를 찾을 수 없습니다.");
    } finally {
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <SearchInput
        value={keyword}
        onChangeText={handleChangeKeyword}
        placeholder="검색할 역을 입력하세요"
        onSubmit={() => handleSearchSubmit()}
        onClear={handleClearSearch}
      />

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
    padding: 20,
  },
  favoriteListContainer: {
    marginTop: 20,
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  favoriteItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  favoriteText: {
    fontSize: 16,
    color: "#333",
  },
});

export default StationSearch;
