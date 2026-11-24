/**
 * ISO 날짜 문자열을 'YYYY.MM.DD HH:mm' 형태로 변환한다.
 * @param {string} isoString - ISO 날짜 문자열
 * @returns {string} 포맷된 날짜
 */
export function formatDate(isoString) {
  if (!isoString) {
    return '';
  }
  const date = new Date(isoString);
  const pad = (number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
