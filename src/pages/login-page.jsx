import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PageLayout from '../components/common/page-layout';
import LoginForm from '../components/auth/login-form';
import SignupForm from '../components/auth/signup-form';
import PsSymbols from '../components/ui/ps-symbols';
import { useAuth } from '../hooks/use-auth';

/**
 * 로그인 / 회원가입 페이지 (탭 메뉴 형식)
 *
 * Example usage:
 * <Route path="/login" element={ <LoginPage /> } />
 */
function LoginPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [isConfirmNotice, setIsConfirmNotice] = useState(false);

  if (!isLoading && user) {
    return <Navigate to="/" replace />;
  }

  const goHome = () => navigate('/');

  const handleNeedConfirm = () => {
    setIsConfirmNotice(true);
    setTab(0);
  };

  return (
    <PageLayout maxWidth="xs" isCentered>
      <Paper elevation={ 0 } sx={ { p: { xs: 3, md: 4 }, border: '1px solid', borderColor: 'divider', boxShadow: '0 12px 40px rgba(0,112,209,0.12)' } }>
        <Box sx={ { textAlign: 'center', mb: 2 } }>
          <PsSymbols fontSize="1.6rem" />
          <Box sx={ { mt: 1, fontSize: { xs: '1.6rem', md: '1.9rem' }, fontWeight: 900, color: 'primary.main' } }>ps-station</Box>
          <Box sx={ { color: 'text.secondary', fontSize: '0.95rem' } }>게이머들의 아지트에 오신 걸 환영해요 🎮</Box>
        </Box>
        <Tabs value={ tab } onChange={ (_event, value) => setTab(value) } variant="fullWidth" sx={ { mb: 3 } }>
          <Tab label="로그인" />
          <Tab label="회원가입" />
        </Tabs>
        { isConfirmNotice && (
          <Alert severity="success" sx={ { mb: 2 } }>
            가입 완료! 이메일로 보낸 인증 링크를 누른 뒤 로그인해 주세요.
          </Alert>
        ) }
        { tab === 0 ? (
          <LoginForm onSuccess={ goHome } onGoSignup={ () => setTab(1) } />
        ) : (
          <SignupForm onSuccess={ goHome } onNeedConfirm={ handleNeedConfirm } />
        ) }
      </Paper>
    </PageLayout>
  );
}

export default LoginPage;
