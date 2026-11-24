import Box from '@mui/material/Box';
import { psColors } from '../../theme';

/**
 * PlayStation 심볼(△○✕□)을 컬러로 표시한다.
 *
 * Props:
 * @param {string} fontSize - 심볼 크기 [Optional, 기본값: '1.2rem']
 * @param {number} opacity - 투명도 [Optional, 기본값: 1]
 *
 * Example usage:
 * <PsSymbols fontSize="2rem" />
 */
function PsSymbols({ fontSize = '1.2rem', opacity = 1 }) {
  const symbols = [
    { char: '△', color: psColors.triangle },
    { char: '○', color: psColors.circle },
    { char: '✕', color: psColors.cross },
    { char: '□', color: psColors.square },
  ];

  return (
    <Box component="span" sx={ { display: 'inline-flex', gap: 0.5, fontSize, fontWeight: 900, opacity, lineHeight: 1 } } aria-hidden="true">
      { symbols.map((symbol) => (
        <Box key={ symbol.char } component="span" sx={ { color: symbol.color } }>
          { symbol.char }
        </Box>
      )) }
    </Box>
  );
}

export default PsSymbols;
