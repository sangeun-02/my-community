import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ReplyIcon from '@mui/icons-material/Reply';
import CommentForm from './comment-form';
import { formatDate } from '../../utils/format-date';

/** 들여쓰기가 적용되는 최대 깊이 */
const MAX_INDENT_DEPTH = 3;

/**
 * 댓글 한 개와 그 아래 답글들을 재귀적으로 표시한다.
 *
 * Props:
 * @param {object} comment - 댓글 데이터 (children 배열 포함) [Required]
 * @param {number} depth - 현재 깊이 [Optional, 기본값: 0]
 * @param {string} currentUserId - 로그인 사용자 id [Optional]
 * @param {function} onReply - (parentId, content) => Promise, 답글 저장 함수 [Required]
 * @param {function} onDelete - (commentId) => Promise, 댓글 삭제 함수 [Required]
 * @param {function} onRequireLogin - 비로그인 상태에서 답글 시도 시 실행할 함수 [Required]
 *
 * Example usage:
 * <CommentItem comment={ node } onReply={ addReply } onDelete={ remove } onRequireLogin={ goLogin } />
 */
function CommentItem({ comment, depth = 0, currentUserId, onReply, onDelete, onRequireLogin }) {
  const [isReplying, setIsReplying] = useState(false);
  const hasChildren = comment.children.length > 0;
  const isMine = currentUserId && currentUserId === comment.author_id;

  const handleReplyClick = () => {
    if (!currentUserId) {
      onRequireLogin();
      return;
    }
    setIsReplying((prev) => !prev);
  };

  const handleReplySubmit = async (content) => {
    await onReply(comment.id, content);
    setIsReplying(false);
  };

  return (
    <Box sx={ { mt: 1.5 } }>
      <Box sx={ { p: 1.5, borderRadius: 3, bgcolor: depth === 0 ? 'background.paper' : '#F7FAFF', border: '1px solid', borderColor: 'divider' } }>
        <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.85rem', color: 'text.secondary' } }>
          <Box component="span" sx={ { fontWeight: 700, color: 'text.primary' } }>{ comment.profiles?.username ?? '알 수 없음' }</Box>
          <Box component="span">{ formatDate(comment.created_at) }</Box>
        </Box>
        <Box sx={ { mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.6 } }>{ comment.content }</Box>
        <Box sx={ { mt: 0.5, display: 'flex', gap: 0.5 } }>
          <Button size="small" startIcon={ <ReplyIcon /> } onClick={ handleReplyClick }>
            답글
          </Button>
          { isMine && !hasChildren && (
            <Button size="small" color="inherit" onClick={ () => onDelete(comment.id) }>
              삭제
            </Button>
          ) }
        </Box>
        { isReplying && (
          <Box sx={ { mt: 1 } }>
            <CommentForm onSubmit={ handleReplySubmit } onCancel={ () => setIsReplying(false) } placeholder={ `${comment.profiles?.username ?? ''}님에게 답글 남기기` } submitLabel="답글 등록" />
          </Box>
        ) }
      </Box>
      { hasChildren && (
        <Box sx={ { ml: depth < MAX_INDENT_DEPTH ? { xs: 2, md: 4 } : 0, borderLeft: depth < MAX_INDENT_DEPTH ? '3px solid #0070D133' : 'none', pl: depth < MAX_INDENT_DEPTH ? 1 : 0 } }>
          { comment.children.map((child) => (
            <CommentItem key={ child.id } comment={ child } depth={ depth + 1 } currentUserId={ currentUserId } onReply={ onReply } onDelete={ onDelete } onRequireLogin={ onRequireLogin } />
          )) }
        </Box>
      ) }
    </Box>
  );
}

export default CommentItem;
