import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppHeader from './app-header';
import AppFooter from './app-footer';

/**
 * 헤더/푸터를 포함한 공통 페이지 레이아웃
 *
 * Props:
 * @param {node} children - 페이지 내용 [Required]
 * @param {string} maxWidth - Container 최대 너비 [Optional, 기본값: 'md']
 * @param {boolean} isCentered - 본문 세로 중앙 정렬 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <PageLayout isCentered><LoginForm /></PageLayout>
 */
function PageLayout({ children, maxWidth = 'md', isCentered = false }) {
  return (
    <Box sx={ { width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' } }>
      <AppHeader />
      <Box component="main" sx={ { flex: 1, display: 'flex', justifyContent: 'center', alignItems: isCentered ? 'center' : 'flex-start', py: { xs: 2, md: 4 } } }>
        <Container maxWidth={ maxWidth } sx={ { px: { xs: 2, md: 3 } } }>
          { children }
        </Container>
      </Box>
      <AppFooter />
    </Box>
  );
}

export default PageLayout;
