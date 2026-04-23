'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35',
    },
    secondary: {
      main: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'var(--font-noto-sans-thai), sans-serif',
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          '@media (max-width: 767px)': {
            fontSize: '16px',
          },
        },
        input: {
          '@media (max-width: 767px)': {
            fontSize: '16px',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          '@media (max-width: 767px)': {
            fontSize: '16px',
          },
        },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider 
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {children}
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
