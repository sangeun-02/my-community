/**
 * 본문을 공백 정리 후 지정한 글자 수로 줄여 미리보기를 만든다.
 * @param {string} content - 게시물 본문
 * @param {number} maxLength - 최대 글자 수 (기본값: 20)
 * @returns {string} 미리보기 문자열
 */
export function makePreview(content, maxLength = 20) {
  const text = (content ?? '').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
