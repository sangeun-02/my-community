import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useAuth } from '../../hooks/use-auth';
import PsSymbols from '../ui/ps-symbols';

/**
 * 상단 헤더 (로고, 글쓰기, 로그인/로그아웃)
 *
 * Example usage:
 * <AppHeader />
 */
function AppHeader() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={ 0 } sx={ { borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' } }>
      <Container maxWidth="md" sx={ { px: { xs: 2, md: 3 } } }>
        <Toolbar disableGutters sx={ { gap: 1, minHeight: { xs: 56, md: 64 } } }>
          <Box component={ RouterLink } to="/" sx={ { display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'primary.main', flexGrow: 1 } }>
            <SportsEsportsIcon sx={ { fontSize: { xs: 28, md: 34 } } } />
            <Box component="span" sx={ { fontSize: { xs: '1.2rem', md: '1.5rem' }, fontWeight: 900, letterSpacing: '-0.03em' } }>
              ps-station
            </Box>
            <Box sx={ { display: { xs: 'none', sm: 'block' } } }>
              <PsSymbols fontSize="0.9rem" />
            </Box>
          </Box>

          { user ? (
            <>
              <Chip label={ profile?.username ?? '게이머' } color="primary" variant="outlined" sx={ { fontWeight: 700, display: { xs: 'none', sm: 'inline-flex' } } } />
              <Button component={ RouterLink } to="/write" variant="contained" size="small" startIcon={ <EditIcon /> }>
                글쓰기
              </Button>
              <Button onClick={ handleSignOut } size="small" color="inherit">
                로그아웃
              </Button>
            </>
          ) : (
            <Button component={ RouterLink } to="/login" variant="contained" size="small">
              로그인
            </Button>
          ) }
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppHeader;
