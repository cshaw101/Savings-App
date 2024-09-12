import { createTheme, ThemeProvider } from '@mui/material/styles';
import App from './App';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#1976d2',  // Google Blue
    },
    secondary: {
      main: '#f50057',  // Pink
    },
    error: {
      main: '#d32f2f',  // Red
    },
    warning: {
      main: '#ffa726',  // Orange
    },
    success: {
      main: '#388e3c',  // Green
    },
    background: {
      default: '#f5f5f5',  // Light Grey Background
    },
  },
});

function AppWithTheme() {
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}

export default AppWithTheme;
