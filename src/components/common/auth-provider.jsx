import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AuthContext } from '../../hooks/use-auth';

/**
 * 인증 상태(세션, 프로필)를 관리하고 하위 컴포넌트에 제공한다.
 *
 * Props:
 * @param {node} children - 하위 컴포넌트 [Required]
 *
 * Example usage:
 * <AuthProvider><App /></AuthProvider>
 */
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /** 세션 변경 감지 */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  /** 로그인 사용자의 프로필(닉네임) 조회 */
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    supabase
      .from('profiles')
      .select('id, username, name')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  const signIn = useCallback(
    (email, password) => supabase.auth.signInWithPassword({ email, password }),
    [],
  );

  const signUp = useCallback(
    ({ email, password, name, nickname }) =>
      supabase.auth.signUp({
        email,
        password,
        options: { data: { name, username: nickname } },
      }),
    [],
  );

  const signOut = useCallback(() => supabase.auth.signOut(), []);

  const value = useMemo(
    () => ({ user, profile, isLoading, signIn, signUp, signOut }),
    [user, profile, isLoading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>;
}

export default AuthProvider;
