import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useAuth } from '../../hooks/use-auth';

/**
 * 회원가입 폼 (이름, 닉네임, 이메일, 비밀번호)
 *
 * Props:
 * @param {function} onSuccess - 가입 후 바로 로그인된 경우 실행할 함수 [Required]
 * @param {function} onNeedConfirm - 이메일 인증이 필요한 경우 실행할 함수 [Required]
 *
 * Example usage:
 * <SignupForm onSuccess={ goHome } onNeedConfirm={ () => setTab(0) } />
 */
function SignupForm({ onSuccess, onNeedConfirm }) {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: '', nickname: '', email: '', password: '', passwordCheck: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    if (form.nickname.trim().length < 3 || form.nickname.trim().length > 20) {
      setErrorMessage('닉네임은 3~20자로 입력해 주세요.');
      return;
    }
    if (form.password.length < 6) {
      setErrorMessage('비밀번호는 6자 이상이어야 해요.');
      return;
    }
    if (form.password !== form.passwordCheck) {
      setErrorMessage('비밀번호가 서로 달라요.');
      return;
    }
    setIsSubmitting(true);
    const { data, error } = await signUp({
      email: form.email.trim(),
      password: form.password,
      name: form.name.trim(),
      nickname: form.nickname.trim(),
    });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(
        error.message.includes('already registered') || error.message.includes('profiles_username_key')
          ? '이미 사용 중인 이메일 또는 닉네임이에요.'
          : `가입에 실패했어요: ${error.message}`,
      );
      return;
    }
    if (data.session) {
      onSuccess();
    } else {
      onNeedConfirm();
    }
  };

  return (
    <Box component="form" onSubmit={ handleSubmit } sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
      <TextField label="이름" value={ form.name } onChange={ handleChange('name') } required autoComplete="name" fullWidth />
      <TextField label="닉네임 (3~20자)" value={ form.nickname } onChange={ handleChange('nickname') } required fullWidth />
      <TextField label="이메일 (로그인 아이디)" type="email" value={ form.email } onChange={ handleChange('email') } required autoComplete="email" fullWidth />
      <TextField label="비밀번호 (6자 이상)" type="password" value={ form.password } onChange={ handleChange('password') } required autoComplete="new-password" fullWidth />
      <TextField label="비밀번호 확인" type="password" value={ form.passwordCheck } onChange={ handleChange('passwordCheck') } required autoComplete="new-password" fullWidth />
      { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }
      <Button type="submit" variant="contained" size="large" disabled={ isSubmitting } sx={ { py: 1.3 } }>
        { isSubmitting ? '가입 중...' : '가입하고 시작하기' }
      </Button>
    </Box>
  );
}

export default SignupForm;
