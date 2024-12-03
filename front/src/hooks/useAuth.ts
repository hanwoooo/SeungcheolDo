import { useMutation, useQuery } from '@tanstack/react-query';
import { postLogin, postSignup, logout, getProfile } from '../api/auth'; // 로그아웃 API 추가
import { AxiosError } from 'axios';
import { Alert } from 'react-native';
import { useAuthContext } from './AuthContext'; // AuthContext 사용
import { queryKeys } from '@/constants/keys';
import { UseQueryCustomOptions } from '@/types/common';
import { ResponseProfile } from '@/types/domain';

function getErrorMessage(error: AxiosError): string {
  const status = error.response?.status;

  if (status === 400) return '입력값을 확인해주세요.';
  if (status === 401) return '인증 정보가 올바르지 않습니다.';
  if (status === 403) return '권한이 없습니다.';
  if (status === 404 || 500) return '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';

  return '알 수 없는 오류가 발생했습니다.';
}

function useLogin() {
  const { setIsLogin } = useAuthContext(); // 전역 상태 사용

  return useMutation({
    mutationFn: postLogin,
    onSuccess: () => {
      console.log('Login Success:');
      setIsLogin(true); // 로그인 성공 시 즉시 전역 상태 업데이트
      Alert.alert('로그인 성공', '환영합니다! 👋');
    },
    onError: (error: AxiosError) => {
      const message = getErrorMessage(error);
      Alert.alert('로그인 실패', message);
    },
  });
}

function useSignup() {
  return useMutation({
    mutationFn: postSignup,
    onSuccess: () => {
      Alert.alert('회원가입 성공', '가입을 환영합니다! 🎉');
    },
    onError: (error: AxiosError) => {
      const message = getErrorMessage(error);
      Alert.alert('회원가입 실패', message);
    },
  });
}

function useLogout() {
  const { setIsLogin } = useAuthContext(); // 전역 상태 사용

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      console.log('로그아웃 성공');
      setIsLogin(false); // 로그아웃 성공 시 전역 상태 업데이트
      Alert.alert('로그아웃 성공', '성공적으로 로그아웃되었습니다. 👋');
    },
    onError: (error: AxiosError) => {
      const message = getErrorMessage(error);
      Alert.alert('로그아웃 실패', message);
    },
  });
}

function useGetProfile(queryOptions?: UseQueryCustomOptions<ResponseProfile>) {
  return useQuery({
    queryFn: getProfile,
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    ...queryOptions,
  });
}

function useAuth() {
  const { isLogin } = useAuthContext(); // 전역 상태 가져오기
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const logoutMutation = useLogout();
  const getProfileQuery = useGetProfile();

  return {
    loginMutation,
    signupMutation,
    logoutMutation,
    isLogin,
    getProfileQuery,
  };
}

export default useAuth;
