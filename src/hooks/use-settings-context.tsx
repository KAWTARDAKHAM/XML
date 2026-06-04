
"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';

type Theme = 'dark' | 'light';

interface SettingsContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  t: any;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    isVerified: boolean;
  };
  updateUser: (data: any) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');
  const [theme, setTheme] = useState<Theme>('dark');
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@fluentgantt.io',
    isVerified: true
  });

  useEffect(() => {
    const savedLang = localStorage.getItem('fg_lang') as Language;
    const savedTheme = localStorage.getItem('fg_theme') as Theme;
    if (savedLang) setLanguage(savedLang);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('fg_lang', language);
    localStorage.setItem('fg_theme', theme);
    document.documentElement.className = theme;
  }, [language, theme]);

  const t = translations[language];

  const updateUser = (data: any) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <SettingsContext.Provider value={{ language, setLanguage, theme, setTheme, t, user, updateUser }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
