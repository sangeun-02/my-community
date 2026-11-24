import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageLayout from '../components/common/page-layout';
import CategoryChip from '../components/ui/category-chip';
import LikeButton from '../components/ui/like-button';
import CommentSection from '../components/comments/comment-section';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/use-auth';
import { formatDate } from '../utils/format-date';

/**
 * 게시물 상세 페이지 (제목, 내용, 작성자, 작성일, 좋아요, 댓글)
 *
 * Example usage:
 * <Route path="/post/:id" element={ <PostDetailPage /> } />
 */
function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    supabase
      .from('post_list')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (isActive) {
          setPost(data);
          setIsLoading(false);
        }
      });
    return () => {
      isActive = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('이 게시물을 삭제할까요?')) {
      return;
    }
    await supabase.from('posts').delete().eq('id', post.id);
    navigate('/');
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Box sx={ { py: 8, textAlign: 'center' } }>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  if (!post) {
    return (
      <PageLayout>
        <Alert severity="warning">게시물을 찾을 수 없어요.</Alert>
      </PageLayout>
    );
  }

  const isMine = user?.id === post.author_id;
  const isEdited = post.updated_at && new Date(post.updated_at) - new Date(post.created_at) > 1000;

  return (
    <PageLayout>
      <Button component={ RouterLink } to="/" startIcon={ <ArrowBackIcon /> } sx={ { mb: 1.5 } }>
        목록으로
      </Button>
      <Paper elevation={ 0 } sx={ { p: { xs: 2.5, md: 4 }, border: '1px solid', borderColor: 'divider' } }>
        <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' } }>
          <CategoryChip category={ post.category } />
          { post.game_title && <Box component="span" sx={ { fontSize: '0.9rem', color: 'text.secondary' } }>🎮 { post.game_title }</Box> }
          { post.rating && <Rating value={ post.rating } readOnly size="small" /> }
        </Box>
        <Box component="h1" sx={ { mt: 1.5, mb: 1, fontSize: { xs: '1.5rem', md: '2.1rem' }, lineHeight: 1.3, wordBreak: 'break-word' } }>
          { post.title }
        </Box>
        <Box sx={ { display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', color: 'text.secondary', fontSize: '0.9rem', pb: 2, borderBottom: '1px solid', borderColor: 'divider' } }>
          <Box component="span" sx={ { fontWeight: 700, color: 'text.primary' } }>{ post.author_name }</Box>
          <Box component="span">{ formatDate(post.created_at) }</Box>
          { isEdited && <Box component="span">(수정 { formatDate(post.updated_at) })</Box> }
        </Box>
        { post.image_url && (
          <Box component="img" src={ post.image_url } alt="첨부 이미지" sx={ { display: 'block', mt: 2, maxWidth: '100%', maxHeight: 520, borderRadius: 3, mx: 'auto' } } />
        ) }
        <Box sx={ { mt: 2.5, minHeight: 80, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.8, fontSize: { xs: '1rem', md: '1.05rem' } } }>
          { post.content }
        </Box>
        <Box sx={ { mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 } }>
          <LikeButton postId={ post.id } />
          { isMine && (
            <Box sx={ { display: 'flex', gap: 1 } }>
              <Button component={ RouterLink } to={ `/write/${post.id}` } size="small" variant="outlined">
                수정
              </Button>
              <Button onClick={ handleDelete } size="small" color="error" variant="outlined">
                삭제
              </Button>
            </Box>
          ) }
        </Box>
      </Paper>
      <CommentSection postId={ post.id } />
    </PageLayout>
  );
}

export default PostDetailPage;
