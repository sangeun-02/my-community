/** 게시판 카테고리 정의 (posts.category 값과 동일) */
export const CATEGORIES = [
  { value: 'free', label: '자유게시판', emoji: '💬', color: '#0070D1' },
  { value: 'proof', label: '플레이 인증', emoji: '🏆', color: '#E56BAE' },
  { value: 'guide', label: '공략', emoji: '🗺️', color: '#1FB886' },
  { value: 'question', label: '질문', emoji: '❓', color: '#F2475A' },
];

/**
 * 카테고리 값으로 카테고리 정보를 찾는다.
 * @param {string} value - 카테고리 값
 * @returns {object} 카테고리 정보
 */
export function getCategory(value) {
  return CATEGORIES.find((category) => category.value === value) ?? CATEGORIES[0];
}
