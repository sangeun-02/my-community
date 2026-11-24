import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CategoryChip from './category-chip';
import { formatDate } from '../../utils/format-date';
import { makePreview } from '../../utils/make-preview';

/**
 * 게시물 목록의 한 항목 (제목, 20자 미리보기, 댓글 수, 좋아요 수, 작성자, 작성일)
 *
 * Props:
 * @param {object} post - post_list 뷰의 게시물 데이터 [Required]
 *
 * Example usage:
 * <PostCard post={ post } />
 */
function PostCard({ post }) {
  return (
    <Paper
      component={ RouterLink }
      to={ `/post/${post.id}` }
      elevation={ 0 }
      sx={ {
        display: 'flex',
        gap: 2,
        p: { xs: 2, md: 2.5 },
        border: '1px solid',
        borderColor: 'divider',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform .15s, box-shadow .15s, border-color .15s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 28px rgba(0,112,209,0.14)', borderColor: 'primary.main' },
      } }
    >
      <Box sx={ { flex: 1, minWidth: 0 } }>
        <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, mb: 0.75, flexWrap: 'wrap' } }>
          <CategoryChip category={ post.category } />
          { post.game_title && (
            <Box component="span" sx={ { fontSize: '0.8rem', color: 'text.secondary', fontWeight: 500 } }>
              🎮 { post.game_title }
            </Box>
          ) }
          { post.rating && <Rating value={ post.rating } readOnly size="small" /> }
        </Box>
        <Box sx={ { fontSize: { xs: '1.05rem', md: '1.2rem' }, fontWeight: 700, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }>
          { post.title }
        </Box>
        <Box sx={ { mt: 0.5, color: 'text.secondary', fontSize: '0.92rem', lineHeight: 1.5 } }>{ makePreview(post.content) }</Box>
        <Box sx={ { mt: 1.25, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', color: 'text.secondary', fontSize: '0.8rem' } }>
          <Box component="span" sx={ { fontWeight: 700, color: 'text.primary' } }>{ post.author_name }</Box>
          <Box component="span">{ formatDate(post.created_at) }</Box>
          <Box component="span" sx={ { display: 'inline-flex', alignItems: 'center', gap: 0.5 } }>
            <ChatBubbleOutlinedIcon sx={ { fontSize: 16 } } /> { post.comment_count }
          </Box>
          <Box component="span" sx={ { display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'secondary.main' } }>
            <FavoriteBorderIcon sx={ { fontSize: 16 } } /> { post.like_count }
          </Box>
        </Box>
      </Box>
      { post.image_url && (
        <Box
          component="img"
          src={ post.image_url }
          alt=""
          loading="lazy"
          sx={ { width: { xs: 72, md: 104 }, height: { xs: 72, md: 104 }, objectFit: 'cover', borderRadius: 3, flexShrink: 0, alignSelf: 'center' } }
        />
      ) }
    </Paper>
  );
}

export default PostCard;
