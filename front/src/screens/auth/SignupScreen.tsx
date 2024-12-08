import React, { useRef } from 'react';
import { Image, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import InputField from '@/components/InputField';
import useForm from '@/hooks/useForm';
import CustomButton from '@/components/CustomButton';
import { validateSignup } from '@/utils';
import useAuth from '@/hooks/useAuth';

function SignupScreen() {
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const passwordConfirmRef = useRef<TextInput | null>(null);
  const { signupMutation, loginMutation } = useAuth();

  const signup = useForm({
    initialValue: { userName: '', email: '', password: '', passwordConfirm: '' },
    validate: validateSignup,
  });

  const handleSubmit = () => {
    const { userName, email, password } = signup.values;

    signupMutation.mutate({ userName, email, password }, {
      onSuccess: () => loginMutation.mutate({ email, password }),
    },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
      <Image source={require('@/assets/크레파스로고.png')} style={styles.logo} />
        <InputField
          autoFocus
          placeholder="이름"
          error={signup.errors.userName}
          touched={signup.touched.userName}
          returnKeyType='next'
          blurOnSubmit={false}
          onSubmitEditing={() => emailRef.current?.focus()}
          {...signup.getTextInputProps('userName')}
        />
        <InputField
          ref={emailRef}
          placeholder="이메일"
          error={signup.errors.email}
          touched={signup.touched.email}
          inputMode="email"
          returnKeyType='next'
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current?.focus()}
          {...signup.getTextInputProps('email')}
        />
        <InputField
          ref={passwordRef}
          placeholder="비밀번호"
          textContentType='oneTimeCode'
          error={signup.errors.password}
          touched={signup.touched.password}
          secureTextEntry
          returnKeyType='next'
          blurOnSubmit={false}
          onSubmitEditing={() => passwordConfirmRef.current?.focus()}
          {...signup.getTextInputProps('password')}
        />
        <InputField
          ref={passwordConfirmRef}
          placeholder="비밀번호 확인"
          error={signup.errors.passwordConfirm}
          touched={signup.touched.passwordConfirm}
          secureTextEntry
          onSubmitEditing={handleSubmit}
          {...signup.getTextInputProps('passwordConfirm')} />
      </View>
      <CustomButton label='회원가입' onPress={handleSubmit} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
    marginTop: 100,
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

export default SignupScreen;