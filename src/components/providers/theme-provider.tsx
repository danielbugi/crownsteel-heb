'use client';

import * as React from 'react';

type ThemeProviderProps = {
  children: React.ReactNode;
};

// Simplified provider - no theme switching needed
export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>;
}
