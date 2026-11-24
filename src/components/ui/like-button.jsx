import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/use-auth';

/**
 * 게시물 좋아요 버튼 (로그인 필요, 토글 방식)
 *
 * Props:
 * @param {number} postId - 게시물 번호 [Required]
 *
 * Example usage:
 * <LikeButton postId={ 12 } />
 */
function LikeButton({ postId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const loadLikes = useCallback(async () => {
    const { count: total } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('post_id', postId);
    setCount(total ?? 0);
    if (user) {
      const { data } = await supabase.from('likes').select('post_id').eq('post_id', postId).eq('user_id', user.id).maybeSingle();
      setIsLiked(Boolean(data));
    } else {
      setIsLiked(false);
    }
  }, [postId, user]);

  useEffect(() => {
    loadLikes();
  }, [loadLikes]);

  const handleToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsBusy(true);
    if (isLiked) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
    }
    await loadLikes();
    setIsBusy(false);
  };

  return (
    <Button
      onClick={ handleToggle }
      disabled={ isBusy }
      variant={ isLiked ? 'contained' : 'outlined' }
      color="secondary"
      startIcon={ isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
    >
      좋아요 { count }
    </Button>
  );
}

export default LikeButton;
