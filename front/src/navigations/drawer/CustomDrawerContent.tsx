import { colors } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { getProfileQuery, logoutMutation } = useAuth();
  const { memberName, memberEmail, memberImage } = getProfileQuery.data || {};
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  return (
    <SafeAreaView style={styles.container}>
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.userInfoContainer}>
          <View style={styles.userImageContainer}>
            {!memberImage &&  // 기존에는 imageUri === null 이였음
              <Image
                source={require('@/assets/user-default.png')}
                style={styles.userImage}
              />}
            {memberImage !== null && (
              <Image
                source={{ uri: 'http://192.168.0.76:8080' + memberImage }}
                style={styles.userImage}
              />
            )}
          </View>
          <Text style={styles.nameText}>{memberName ?? memberEmail}</Text>
        </View>
        <View style={styles.divider} />
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: colors.WHITE,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
    marginHorizontal: 15,
  },
  nameText: {
    color: colors.BLACK,
  },
  userImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    overflow: 'hidden',
  },
  userImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  divider: {
    height: 1, // 구분선 두께
    backgroundColor: colors.GRAY_500, // 구분선 색상
    marginVertical: 10, // 위아래 여백
    shadowColor: '#000', // 그림자 색상
    shadowOffset: { width: 0, height: 1 }, // 그림자 방향
    shadowOpacity: 0.1, // 그림자 투명도
    shadowRadius: 5, // 그림자 퍼짐 정도
    elevation: 5, // Android 그림자
  },
  logoutButton: {
    backgroundColor: colors.WHITE,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderColor: colors.BLUE_700,
    borderWidth: 1,
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 5,
  },
  logoutButtonText: {
    color: colors.BLACK,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomDrawerContent;