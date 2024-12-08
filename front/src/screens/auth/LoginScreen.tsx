import React, { useRef } from "react";
import { Image, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, TextInput, View } from "react-native";
import InputField from "@/components/public/InputField";
import CustomButton from "@/components/public/CustomButton";
import useForm from "@/hooks/useForm";
import { validateLogin } from "@/utils";
import useAuth from "@/hooks/useAuth";

function LoginScreen() {
  const passwordRef = useRef<TextInput | null>(null);
  const { loginMutation } = useAuth();
  const login = useForm({
    initialValue: { email: '', password: '', },
    validate: validateLogin,
  });

  const handleSubmit = () => {
    loginMutation.mutate(login.values);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.keyboardAvoidingView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.inputContainer}>
        <Image source={require('@/assets/크레파스로고.png')} style={styles.logo} />
        <InputField
          autoFocus
          placeholder="이메일"
          error={login.errors.email}
          touched={login.touched.email}
          inputMode="email"
          returnKeyType='next'
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current?.focus()}
          {...login.getTextInputProps('email')}
        />
        <InputField
          ref={passwordRef}
          placeholder="비밀번호"
          error={login.errors.password}
          touched={login.touched.password}
          secureTextEntry
          returnKeyType='join'
          blurOnSubmit={false}
          onSubmitEditing={handleSubmit}
          {...login.getTextInputProps('password')}
        />
      </View>
      <CustomButton
        label="로그인"
        variant="filled"
        size="large"
        onPress={handleSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
    marginTop: 200,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  inputContainer: {
    gap: 20,
    marginBottom: 30,
  },
  logo: {
    alignSelf: 'center',
    width: '100%',
    height: 230,
  },
});

export default LoginScreen;