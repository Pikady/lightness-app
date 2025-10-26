'use client';

import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { GlobalStyles } from '@/styles/GlobalStyles';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyles theme={theme} />
      {children}
    </StyledThemeProvider>
  );
}