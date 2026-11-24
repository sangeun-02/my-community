import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PageLayout from '../components/common/page-layout';
import PostCard from '../components/ui/post-card';
import PsSymbols from '../components/ui/ps-symbols';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/use-auth';
import { CATEGORIES } from '../utils/categories';

/**
 * 게시물 목록 페이지 (카테고리 탭, 히어로 배너)
 *
 * Example usage:
 * <Route path="/" element={ <PostListPage /> } />
 */
function PostListPage() {
  const { user } = useAuth();
  const [category, setCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      setIsLoading(true);
      let query = supabase.from('post_list').select('*').order('created_at', { ascending: false }).limit(50);
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (!isActive) {
        return;
      }
      setErrorMessage(error ? '게시물을 불러오지 못했어요.' : '');
      setPosts(data ?? []);
      setIsLoading(false);
    };
    load();
    return () => {
      isActive = false;
    };
  }, [category]);

  return (
    <PageLayout>
      <Box
        sx={ {
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 3, md: 5 },
          mb: 3,
          borderRadius: 6,
          color: '#fff',
          background: 'linear-gradient(135deg, #0070D1 0%, #003791 100%)',
          boxShadow: '0 16px 40px rgba(0,55,145,0.25)',
        } }
      >
        <Box sx={ { position: 'absolute', right: { xs: -10, md: 30 }, top: { xs: -10, md: 0 }, opacity: 0.18, fontSize: { xs: '6rem', md: '9rem' }, fontWeight: 900, lineHeight: 1, letterSpacing: 8 } } aria-hidden="true">
          △○✕□
        </Box>
        <Box sx={ { position: 'relative' } }>
          <PsSymbols fontSize="1.4rem" />
          <Box sx={ { mt: 1, fontSize: { xs: '1.8rem', md: '2.8rem' }, fontWeight: 900, lineHeight: 1.2 } }>
            오늘은 어떤 게임<br />플레이했나요?
          </Box>
          <Box sx={ { mt: 1, mb: 2.5, fontSize: { xs: '0.95rem', md: '1.1rem' }, opacity: 0.9, lineHeight: 1.5 } }>
            공략도 나누고, 트로피 인증도 하고, 모르는 건 물어보세요 🎮
          </Box>
          <Button component={ RouterLink } to={ user ? '/write' : '/login' } variant="contained" size="large" sx={ { bgcolor: '#fff', color: 'primary.main', '&:hover': { bgcolor: '#EAF3FF' } } }>
            { user ? '✏️ 새 글 쓰기' : '지금 합류하기' }
          </Button>
        </Box>
      </Box>

      <Tabs value={ category } onChange={ (_event, value) => setCategory(value) } variant="scrollable" scrollButtons="auto" sx={ { mb: 2 } }>
        <Tab value="all" label="🔥 전체" />
        { CATEGORIES.map((item) => (
          <Tab key={ item.value } value={ item.value } label={ `${item.emoji} ${item.label}` } />
        )) }
      </Tabs>

      { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }
      { isLoading ? (
        <Box sx={ { py: 8, textAlign: 'center' } }>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={ { display: 'flex', flexDirection: 'column', gap: 1.5 } }>
          { posts.map((post) => (
            <PostCard key={ post.id } post={ post } />
          )) }
          { posts.length === 0 && !errorMessage && (
            <Box sx={ { py: 8, textAlign: 'center', color: 'text.secondary' } }>
              아직 게시물이 없어요. 첫 글의 주인공이 되어보세요! 🏆
            </Box>
          ) }
        </Box>
      ) }
    </PageLayout>
  );
}

export default PostListPage;
