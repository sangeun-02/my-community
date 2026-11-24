import Chip from '@mui/material/Chip';
import { getCategory } from '../../utils/categories';

/**
 * 게시판 카테고리 칩
 *
 * Props:
 * @param {string} category - 카테고리 값(free, proof, guide, question) [Required]
 *
 * Example usage:
 * <CategoryChip category="guide" />
 */
function CategoryChip({ category }) {
  const info = getCategory(category);

  return (
    <Chip
      size="small"
      label={ `${info.emoji} ${info.label}` }
      sx={ { bgcolor: `${info.color}1A`, color: info.color, fontWeight: 700, border: `1px solid ${info.color}55` } }
    />
  );
}

export default CategoryChip;
