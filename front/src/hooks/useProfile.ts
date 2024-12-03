import { getProfile } from '@/api/auth';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
/*
function useProfile() {
  return useQuery(['profile'], getProfile, {
    onError: (error: AxiosError) => {
      console.error('프로필 가져오기 실패:', error.message);
    },
  });
}


export default useProfile;
*/