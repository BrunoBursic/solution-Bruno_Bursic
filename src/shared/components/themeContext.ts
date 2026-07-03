import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

export const THEME_STORAGE_KEY = 'product-catalog-theme'
export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
