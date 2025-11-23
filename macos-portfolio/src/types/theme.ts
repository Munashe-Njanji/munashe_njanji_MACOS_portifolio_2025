// Theme system types

export type ThemeMode = 'light' | 'dark' | 'auto' | 'high-contrast' | 'oled' | 'developer'

export type AccentColor =
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'graphite'

export type DeveloperTheme = 'neon-matrix' | 'monokai-pro' | 'dracula-ui' | 'nord' | 'tokyo-night'

export interface ThemeColors {
  // Base colors
  background: string
  foreground: string
  primary: string
  secondary: string
  accent: string

  // UI Elements
  menuBar: string
  menuBarText: string
  dock: string
  dockGlow: string
  windowChrome: string
  windowBackground: string
  windowBorder: string

  // Text
  textPrimary: string
  textSecondary: string
  textTertiary: string

  // Interactive
  buttonBackground: string
  buttonHover: string
  buttonActive: string

  // Shadows
  shadowLight: string
  shadowMedium: string
  shadowHeavy: string

  // Special
  selection: string
  focus: string
  error: string
  warning: string
  success: string
}

export interface ThemeConfig {
  mode: ThemeMode
  accentColor: AccentColor
  developerTheme?: DeveloperTheme
  colors: ThemeColors
  wallpaper: string
  effects: {
    blur: number
    transparency: number
    glow: boolean
    shadows: boolean
    animations: boolean
  }
}

export interface ThemePreset {
  id: string
  name: string
  description: string
  mode: ThemeMode
  accentColor: AccentColor
  developerTheme?: DeveloperTheme
  wallpaper: string
  colors: ThemeColors
  effects: ThemeConfig['effects']
}
