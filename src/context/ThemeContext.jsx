import React, { createContext, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('accent_color') || '#3b82f6');

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = (currentTheme) => {
      let actualTheme = currentTheme;
      if (currentTheme === 'system') {
        actualTheme = mediaQuery.matches ? 'dark' : 'light';
      }
      root.setAttribute('data-theme', actualTheme);
      root.classList.remove('light', 'dark');
      root.classList.add(actualTheme);
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--primary', accentColor);
    localStorage.setItem('accent_color', accentColor);
  }, [accentColor]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
