import { createTheme } from '@mui/material/styles';

/** PlayStation 심볼 포인트 컬러 */
export const psColors = {
  blue: '#0070D1',
  navy: '#003791',
  triangle: '#1FB886',
  circle: '#F2475A',
  square: '#E56BAE',
  cross: '#3B8EEA',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: psColors.blue, dark: psColors.navy, contrastText: '#fff' },
    secondary: { main: psColors.circle },
    success: { main: psColors.triangle },
    background: { default: '#F3F7FC', paper: '#FFFFFF' },
    text: { primary: '#14213D', secondary: '#5B6B86' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 900 },
    h2: { fontWeight: 900 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: 999 } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
  },
});

export default theme;
