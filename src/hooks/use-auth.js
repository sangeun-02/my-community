import { createContext, useContext } from 'react';

/** 인증 정보를 전달하는 Context */
export const AuthContext = createContext(null);

/**
 * 로그인 사용자 정보를 반환하는 훅
 * @returns {{ user: object|null, profile: object|null, isLoading: boolean, signIn: function, signUp: function, signOut: function }}
 */
export function useAuth() {
  return useContext(AuthContext);
}
