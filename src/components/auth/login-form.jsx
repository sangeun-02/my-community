import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import KeyboardCapslockIcon from '@mui/icons-material/KeyboardCapslock';
import { useAuth } from '../../hooks/use-auth';

/**
 * 로그인 폼 (Caps Lock 감지, 회원가입 유도 문구 포함)
 *
 * Props:
 * @param {function} onSuccess - 로그인 성공 시 실행할 함수 [Required]
 * @param {function} onGoSignup - 회원가입 탭으로 이동하는 함수 [Required]
 *
 * Example usage:
 * <LoginForm onSuccess={ goHome } onGoSignup={ () => setTab(1) } />
 */
function LoginForm({ onSuccess, onGoSignup }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCapsOn, setIsCapsOn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /** Caps Lock 상태를 키 입력 시점에 확인 */
  const handleCapsCheck = (event) => {
    setIsCapsOn(event.getModifierState('CapsLock'));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(
        error.message.includes('Email not confirmed')
          ? '이메일 인증이 필요해요. 메일함을 확인해 주세요.'
          : '아이디(이메일) 또는 비밀번호가 올바르지 않아요.',
      );
      return;
    }
    onSuccess();
  };

  return (
    <Box component="form" onSubmit={ handleSubmit } sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
      <TextField label="아이디 (이메일)" type="email" value={ email } onChange={ (event) => setEmail(event.target.value) } required autoComplete="email" fullWidth />
      <TextField
        label="비밀번호"
        type="password"
        value={ password }
        onChange={ (event) => setPassword(event.target.value) }
        onKeyUp={ handleCapsCheck }
        onKeyDown={ handleCapsCheck }
        onBlur={ () => setIsCapsOn(false) }
        required
        autoComplete="current-password"
        fullWidth
      />
      { isCapsOn && (
        <Alert severity="warning" icon={ <KeyboardCapslockIcon /> }>
          Caps Lock이 켜져 있어요! 비밀번호를 확인해 주세요.
        </Alert>
      ) }
      { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }
      <Button type="submit" variant="contained" size="large" disabled={ isSubmitting } sx={ { py: 1.3 } }>
        { isSubmitting ? '로그인 중...' : '로그인하기' }
      </Button>
      <Box sx={ { textAlign: 'center', color: 'text.secondary', fontSize: '0.95rem' } }>
        아직 계정이 없으신가요?{ ' ' }
        <Box component="span" onClick={ onGoSignup } role="button" tabIndex={ 0 } onKeyDown={ (event) => event.key === 'Enter' && onGoSignup() } sx={ { color: 'primary.main', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' } }>
          회원가입하고 ps-station에 합류하세요!
        </Box>
      </Box>
    </Box>
  );
}

export default LoginForm;
