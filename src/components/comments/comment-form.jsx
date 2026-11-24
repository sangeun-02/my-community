import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

/**
 * 댓글 / 답글 입력 폼
 *
 * Props:
 * @param {function} onSubmit - 내용을 받아 저장하는 비동기 함수 (content) => Promise [Required]
 * @param {function} onCancel - 취소 버튼 클릭 시 실행할 함수 [Optional]
 * @param {string} placeholder - 입력창 안내 문구 [Optional, 기본값: '댓글을 남겨보세요']
 * @param {string} submitLabel - 등록 버튼 문구 [Optional, 기본값: '댓글 등록']
 *
 * Example usage:
 * <CommentForm onSubmit={ handleAdd } placeholder="답글을 입력하세요" />
 */
function CommentForm({ onSubmit, onCancel, placeholder = '댓글을 남겨보세요', submitLabel = '댓글 등록' }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      return;
    }
    setIsSubmitting(true);
    await onSubmit(content.trim());
    setContent('');
    setIsSubmitting(false);
  };

  return (
    <Box component="form" onSubmit={ handleSubmit } sx={ { display: 'flex', flexDirection: 'column', gap: 1 } }>
      <TextField
        value={ content }
        onChange={ (event) => setContent(event.target.value) }
        placeholder={ placeholder }
        multiline
        minRows={ 2 }
        fullWidth
        slotProps={ { htmlInput: { maxLength: 1000 } } }
      />
      <Box sx={ { display: 'flex', justifyContent: 'flex-end', gap: 1 } }>
        { onCancel && (
          <Button onClick={ onCancel } color="inherit" size="small">
            취소
          </Button>
        ) }
        <Button type="submit" variant="contained" size="small" disabled={ isSubmitting || !content.trim() }>
          { submitLabel }
        </Button>
      </Box>
    </Box>
  );
}

export default CommentForm;
