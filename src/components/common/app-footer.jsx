import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import PsSymbols from '../ui/ps-symbols';

/**
 * 하단 푸터
 *
 * Example usage:
 * <AppFooter />
 */
function AppFooter() {
  return (
    <Box component="footer" sx={ { py: 4, textAlign: 'center', color: 'text.secondary', fontSize: '0.85rem' } }>
      <Container maxWidth="md">
        <PsSymbols fontSize="1.1rem" opacity={ 0.8 } />
        <Box sx={ { mt: 1 } }>ps-station · 플레이스테이션 게이머들의 아지트</Box>
      </Container>
    </Box>
  );
}

export default AppFooter;
