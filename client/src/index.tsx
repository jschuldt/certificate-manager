import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { theme, globalStyles } from './styles/theme';
import App from './App';
import GlobalStyles from '@mui/material/GlobalStyles';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles.styles} />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

export {}; // Add this line to make the file a module
