import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/use-auth';
import CommentForm from './comment-form';
import CommentItem from './comment-item';

/**
 * 게시물의 댓글 영역 (댓글 작성, 답글, 삭제)
 *
 * Props:
 * @param {number} postId - 게시물 번호 [Required]
 * @param {function} onChange - 댓글 수가 바뀔 때 실행할 함수 (count) => void [Optional]
 *
 * Example usage:
 * <CommentSection postId={ 12 } />
 */
function CommentSection({ postId, onChange }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);

  const loadComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('id, post_id, author_id, parent_id, content, created_at, profiles(username)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    setComments(data ?? []);
    onChange?.((data ?? []).length);
  }, [postId, onChange]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  /** 평면 목록을 parent_id 기준 트리로 변환 */
  const tree = useMemo(() => {
    const nodes = new Map(comments.map((comment) => [comment.id, { ...comment, children: [] }]));
    const roots = [];
    nodes.forEach((node) => {
      const parent = node.parent_id ? nodes.get(node.parent_id) : null;
      (parent ? parent.children : roots).push(node);
    });
    return roots;
  }, [comments]);

  const addComment = async (content, parentId = null) => {
    await supabase.from('comments').insert({ post_id: postId, author_id: user.id, parent_id: parentId, content });
    await loadComments();
  };

  const deleteComment = async (commentId) => {
    await supabase.from('comments').delete().eq('id', commentId);
    await loadComments();
  };

  return (
    <Box sx={ { mt: 4 } }>
      <Box sx={ { fontSize: '1.2rem', fontWeight: 800, mb: 1.5 } }>💬 댓글 { comments.length }</Box>
      { user ? (
        <CommentForm onSubmit={ (content) => addComment(content) } />
      ) : (
        <Box sx={ { p: 2, textAlign: 'center', borderRadius: 3, bgcolor: '#EAF3FF', color: 'text.secondary' } }>
          댓글을 남기려면 로그인이 필요해요.{ ' ' }
          <Button size="small" onClick={ () => navigate('/login') }>
            로그인하기
          </Button>
        </Box>
      ) }
      { tree.map((comment) => (
        <CommentItem key={ comment.id } comment={ comment } currentUserId={ user?.id } onReply={ (parentId, content) => addComment(content, parentId) } onDelete={ deleteComment } onRequireLogin={ () => navigate('/login') } />
      )) }
      { tree.length === 0 && <Box sx={ { mt: 2, textAlign: 'center', color: 'text.secondary' } }>첫 댓글의 주인공이 되어보세요! 🎮</Box> }
    </Box>
  );
}

export default CommentSection;
