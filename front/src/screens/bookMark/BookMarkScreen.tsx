import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, FlatList } from "react-native";
import {
  getStationList,
  addFavorite,
  delFavorite,
  getFavorite,
  isStation,
} from "@/api/auth";
import StationItem from "@/components/BookMark/StationItem";
import { StationInformation, Stationlist } from "@/types/domain";
import SearchInput from "@/components/Map/StationSearch/SearchInput";
import { colors } from "@/constants";

function BookMarkScreen() {
  const [stationList, setStationList] = useState<Stationlist>([]);
  const [searchResult, setSearchResult] = useState<StationInformation | null>(null);
  const [favorites, setFavorites] = useState<Stationlist>([]);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchStations = async () => {
    try {
      const data = await getStationList();
      setStationList(data);
    } catch (error) {
      Alert.alert("리스트 에러", "역 리스트 불러오는 것에 실패했습니다.");
    }
  };

  const fetchFavorites = async () => {
    try {
      const data = await getFavorite();
      setFavorites(data);
      fetchStations();
    } catch (error) {
      Alert.alert("리스트 에러", "즐겨찾기 불러오는 것에 실패했습니다.");
    }
  };

  const handleSearchSubmit = async () => {
    if (!searchText) return;
    try {
      setIsSearching(true);
      const data = await isStation({ stationName: searchText });
      setSearchResult(data);
    } catch (error) {
      Alert.alert("역 없음", "맞는 역을 찾을 수 없습니다.");
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    setSearchResult(null);
    setIsSearching(false);
  };

  const handleAddFavorite = async (stationName: string) => {
    try {
      const result = await addFavorite({ stationName: stationName });
      fetchFavorites();
    } catch (error) {
      Alert.alert("즐겨찾기 에러", "이미 즐겨찾기에 있는 역입니다.");
    }
  };

  const handleRemoveFavorite = async (stationName: string) => {
    try {
      const result = await delFavorite({ stationName: stationName });
      fetchFavorites();
    } catch (error) {
      Alert.alert("즐겨찾기 에러", "즐겨찾기에 없는 역입니다.");
    }
  };

  useEffect(() => {
    fetchFavorites();
    fetchStations();
  }, []);

  return (
    <View style={styles.container}>
      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="역 검색"
        onSubmit={handleSearchSubmit}
        onClear={handleClearSearch}
      />
      {isSearching && searchResult ? (
        <View>
          <Text style={styles.sectionTitle}>검색 결과</Text>
          <StationItem
            key={searchResult.stationName}
            stationName={searchResult.stationName}
            isFavorite={favorites.some((fav) => fav.stationName === searchResult.stationName)}
            onAddFavorite={() => handleAddFavorite(searchResult.stationName)}
            onRemoveFavorite={() => handleRemoveFavorite(searchResult.stationName)}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.sectionTitle}>즐겨찾기</Text>
          {favorites.map((item) => (
            <StationItem
              key={item.stationName}
              stationName={item.stationName}
              isFavorite={true}
              onRemoveFavorite={() => handleRemoveFavorite(item.stationName)}
            />
          ))}

          <Text style={styles.sectionTitle}>전체 역</Text>
          <FlatList
            data={stationList}
            keyExtractor={(item) => item.stationName}
            renderItem={({ item }) => (
              <StationItem
                stationName={item.stationName}
                isFavorite={favorites.some((fav) => fav.stationName === item.stationName)}
                onAddFavorite={() => handleAddFavorite(item.stationName)}
                onRemoveFavorite={() => handleRemoveFavorite(item.stationName)}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.WHITE,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
});

export default BookMarkScreen;
