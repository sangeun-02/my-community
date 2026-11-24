import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PageLayout from '../components/common/page-layout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/use-auth';
import { CATEGORIES } from '../utils/categories';

/** 업로드 가능한 최대 이미지 크기 (5MB) */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/**
 * 게시물 작성 / 수정 페이지 (카테고리, 게임명, 별점, 사진 업로드)
 *
 * Example usage:
 * <Route path="/write" element={ <PostWritePage /> } />
 * <Route path="/write/:id" element={ <PostWritePage /> } />
 */
function PostWritePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [form, setForm] = useState({ category: 'free', title: '', content: '', gameTitle: '', rating: null });
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /** 수정 모드: 기존 게시물 불러오기 */
  useEffect(() => {
    if (!id) {
      return;
    }
    supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm({ category: data.category, title: data.title, content: data.content, gameTitle: data.game_title ?? '', rating: data.rating });
          setImageUrl(data.image_url);
        }
      });
  }, [id]);

  if (!isLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/') || file.size > MAX_IMAGE_SIZE) {
      setErrorMessage('5MB 이하의 이미지 파일만 올릴 수 있어요.');
      return;
    }
    setErrorMessage('');
    setIsUploading(true);
    const extension = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from('post-images').upload(path, file);
    if (error) {
      setErrorMessage('사진 업로드에 실패했어요.');
    } else {
      setImageUrl(supabase.storage.from('post-images').getPublicUrl(path).data.publicUrl);
    }
    setIsUploading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    const payload = {
      category: form.category,
      title: form.title.trim(),
      content: form.content.trim(),
      game_title: form.gameTitle.trim() || null,
      rating: form.rating,
      image_url: imageUrl,
    };
    const { data, error } = id
      ? await supabase.from('posts').update(payload).eq('id', id).select('id').single()
      : await supabase.from('posts').insert({ ...payload, author_id: user.id }).select('id').single();
    setIsSubmitting(false);
    if (error) {
      setErrorMessage('저장에 실패했어요. 입력 내용을 확인해 주세요.');
      return;
    }
    navigate(`/post/${data.id}`);
  };

  return (
    <PageLayout maxWidth="sm">
      <Paper elevation={ 0 } sx={ { p: { xs: 2.5, md: 4 }, border: '1px solid', borderColor: 'divider' } }>
        <Box sx={ { fontSize: { xs: '1.5rem', md: '1.9rem' }, fontWeight: 900, mb: 2.5 } }>{ id ? '✏️ 게시물 수정' : '🎮 새 글 쓰기' }</Box>
        <Box component="form" onSubmit={ handleSubmit } sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
          <TextField select label="게시판" value={ form.category } onChange={ handleChange('category') } fullWidth>
            { CATEGORIES.map((item) => (
              <MenuItem key={ item.value } value={ item.value }>
                { item.emoji } { item.label }
              </MenuItem>
            )) }
          </TextField>
          <TextField label="제목" value={ form.title } onChange={ handleChange('title') } required fullWidth slotProps={ { htmlInput: { maxLength: 100 } } } />
          <TextField label="게임 이름 (선택)" value={ form.gameTitle } onChange={ handleChange('gameTitle') } fullWidth />
          <Box sx={ { display: 'flex', alignItems: 'center', gap: 1.5 } }>
            <Box sx={ { color: 'text.secondary' } }>게임 별점</Box>
            <Rating value={ form.rating } onChange={ (_event, value) => setForm((prev) => ({ ...prev, rating: value })) } />
          </Box>
          <TextField label="내용" value={ form.content } onChange={ handleChange('content') } required multiline minRows={ 8 } fullWidth slotProps={ { htmlInput: { maxLength: 5000 } } } />
          <Box>
            <Button component="label" variant="outlined" startIcon={ <AddPhotoAlternateIcon /> } disabled={ isUploading }>
              { isUploading ? '업로드 중...' : '사진 추가' }
              <input type="file" accept="image/*" hidden onChange={ handleImageChange } />
            </Button>
            { imageUrl && (
              <Box sx={ { mt: 1.5, position: 'relative', display: 'inline-block' } }>
                <Box component="img" src={ imageUrl } alt="미리보기" sx={ { display: 'block', maxWidth: '100%', maxHeight: 240, borderRadius: 3 } } />
                <Button size="small" variant="contained" color="inherit" onClick={ () => setImageUrl(null) } sx={ { position: 'absolute', top: 8, right: 8, minWidth: 0, px: 1.5 } }>
                  삭제
                </Button>
              </Box>
            ) }
          </Box>
          { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }
          <Box sx={ { display: 'flex', gap: 1, justifyContent: 'flex-end' } }>
            <Button color="inherit" onClick={ () => navigate(-1) }>
              취소
            </Button>
            <Button type="submit" variant="contained" size="large" disabled={ isSubmitting || isUploading }>
              { isSubmitting ? '저장 중...' : id ? '수정 완료' : '등록하기' }
            </Button>
          </Box>
        </Box>
      </Paper>
    </PageLayout>
  );
}

export default PostWritePage;
