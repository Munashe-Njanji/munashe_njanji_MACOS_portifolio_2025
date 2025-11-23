import type { ThemePreset, ThemeColors } from '@/types/theme'

// Accent color palettes
export const accentColors = {
  blue: '#007AFF',
  purple: '#AF52DE',
  pink: '#FF2D55',
  red: '#FF3B30',
  orange: '#FF9500',
  yellow: '#FFCC00',
  green: '#34C759',
  graphite: '#8E8E93',
}

// Base theme colors
const lightColors: ThemeColors = {
  background: '#F0F0F0',
  foreground: '#FFFFFF',
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#007AFF',

  menuBar: 'rgba(255, 255, 255, 0.8)',
  menuBarText: '#1F2937',
  dock: 'rgba(255, 255, 255, 0.3)',
  dockGlow: 'rgba(0, 0, 0, 0.1)',
  windowChrome: '#ECECEC',
  windowBackground: '#FFFFFF',
  windowBorder: 'rgba(0, 0, 0, 0.1)',

  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  buttonBackground: '#E5E7EB',
  buttonHover: '#D1D5DB',
  buttonActive: '#9CA3AF',

  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
  shadowHeavy: 'rgba(0, 0, 0, 0.25)',

  selection: 'rgba(0, 122, 255, 0.3)',
  focus: '#007AFF',
  error: '#FF3B30',
  warning: '#FF9500',
  success: '#34C759',
}

const darkColors: ThemeColors = {
  background: '#1E1E1E',
  foreground: '#2D2D2D',
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  accent: '#0A84FF',

  menuBar: 'rgba(45, 45, 45, 0.8)',
  menuBarText: '#F9FAFB',
  dock: 'rgba(30, 30, 30, 0.8)',
  dockGlow: 'rgba(255, 255, 255, 0.1)',
  windowChrome: '#2D2D2D',
  windowBackground: '#1E1E1E',
  windowBorder: 'rgba(255, 255, 255, 0.1)',

  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',

  buttonBackground: '#374151',
  buttonHover: '#4B5563',
  buttonActive: '#6B7280',

  shadowLight: 'rgba(0, 0, 0, 0.3)',
  shadowMedium: 'rgba(0, 0, 0, 0.5)',
  shadowHeavy: 'rgba(0, 0, 0, 0.7)',

  selection: 'rgba(10, 132, 255, 0.3)',
  focus: '#0A84FF',
  error: '#FF453A',
  warning: '#FF9F0A',
  success: '#32D74B',
}

const highContrastColors: ThemeColors = {
  background: '#000000',
  foreground: '#FFFFFF',
  primary: '#00A3FF',
  secondary: '#7D7AFF',
  accent: '#00A3FF',

  menuBar: 'rgba(0, 0, 0, 0.95)',
  menuBarText: '#FFFFFF',
  dock: 'rgba(0, 0, 0, 0.95)',
  dockGlow: 'rgba(255, 255, 255, 0.3)',
  windowChrome: '#000000',
  windowBackground: '#FFFFFF',
  windowBorder: '#000000',

  textPrimary: '#000000',
  textSecondary: '#333333',
  textTertiary: '#666666',

  buttonBackground: '#000000',
  buttonHover: '#333333',
  buttonActive: '#666666',

  shadowLight: 'rgba(0, 0, 0, 0.5)',
  shadowMedium: 'rgba(0, 0, 0, 0.7)',
  shadowHeavy: 'rgba(0, 0, 0, 0.9)',

  selection: 'rgba(0, 163, 255, 0.5)',
  focus: '#00A3FF',
  error: '#FF0000',
  warning: '#FFAA00',
  success: '#00FF00',
}

const oledColors: ThemeColors = {
  background: '#000000',
  foreground: '#0A0A0A',
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  accent: '#0A84FF',

  menuBar: 'rgba(0, 0, 0, 0.95)',
  menuBarText: '#FFFFFF',
  dock: 'rgba(0, 0, 0, 0.95)',
  dockGlow: 'rgba(10, 132, 255, 0.3)',
  windowChrome: '#0A0A0A',
  windowBackground: '#000000',
  windowBorder: 'rgba(10, 132, 255, 0.2)',

  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',

  buttonBackground: '#1A1A1A',
  buttonHover: '#2A2A2A',
  buttonActive: '#3A3A3A',

  shadowLight: 'rgba(10, 132, 255, 0.1)',
  shadowMedium: 'rgba(10, 132, 255, 0.2)',
  shadowHeavy: 'rgba(10, 132, 255, 0.3)',

  selection: 'rgba(10, 132, 255, 0.4)',
  focus: '#0A84FF',
  error: '#FF453A',
  warning: '#FF9F0A',
  success: '#32D74B',
}

// Developer theme presets
const neonMatrixColors: ThemeColors = {
  background: '#0D0208',
  foreground: '#1A1423',
  primary: '#00FF41',
  secondary: '#00D9FF',
  accent: '#00FF41',

  menuBar: 'rgba(13, 2, 8, 0.95)',
  menuBarText: '#00FF41',
  dock: 'rgba(13, 2, 8, 0.95)',
  dockGlow: 'rgba(0, 255, 65, 0.5)',
  windowChrome: '#1A1423',
  windowBackground: '#0D0208',
  windowBorder: 'rgba(0, 255, 65, 0.3)',

  textPrimary: '#00FF41',
  textSecondary: '#00D9FF',
  textTertiary: '#39FF14',

  buttonBackground: '#1A1423',
  buttonHover: '#2D2640',
  buttonActive: '#3F3A5C',

  shadowLight: 'rgba(0, 255, 65, 0.2)',
  shadowMedium: 'rgba(0, 255, 65, 0.4)',
  shadowHeavy: 'rgba(0, 255, 65, 0.6)',

  selection: 'rgba(0, 255, 65, 0.3)',
  focus: '#00FF41',
  error: '#FF0055',
  warning: '#FFD700',
  success: '#00FF41',
}

const monokaiProColors: ThemeColors = {
  background: '#2D2A2E',
  foreground: '#403E41',
  primary: '#FF6188',
  secondary: '#FC9867',
  accent: '#FF6188',

  menuBar: 'rgba(45, 42, 46, 0.95)',
  menuBarText: '#FCFCFA',
  dock: 'rgba(45, 42, 46, 0.95)',
  dockGlow: 'rgba(255, 97, 136, 0.3)',
  windowChrome: '#403E41',
  windowBackground: '#2D2A2E',
  windowBorder: 'rgba(255, 97, 136, 0.2)',

  textPrimary: '#FCFCFA',
  textSecondary: '#C1C0C0',
  textTertiary: '#939293',

  buttonBackground: '#403E41',
  buttonHover: '#5B595C',
  buttonActive: '#727072',

  shadowLight: 'rgba(0, 0, 0, 0.3)',
  shadowMedium: 'rgba(0, 0, 0, 0.5)',
  shadowHeavy: 'rgba(0, 0, 0, 0.7)',

  selection: 'rgba(255, 97, 136, 0.3)',
  focus: '#FF6188',
  error: '#FF6188',
  warning: '#FFD866',
  success: '#A9DC76',
}

const draculaColors: ThemeColors = {
  background: '#282A36',
  foreground: '#44475A',
  primary: '#BD93F9',
  secondary: '#FF79C6',
  accent: '#BD93F9',

  menuBar: 'rgba(40, 42, 54, 0.95)',
  menuBarText: '#F8F8F2',
  dock: 'rgba(40, 42, 54, 0.95)',
  dockGlow: 'rgba(189, 147, 249, 0.4)',
  windowChrome: '#44475A',
  windowBackground: '#282A36',
  windowBorder: 'rgba(189, 147, 249, 0.3)',

  textPrimary: '#F8F8F2',
  textSecondary: '#BFBFBF',
  textTertiary: '#6272A4',

  buttonBackground: '#44475A',
  buttonHover: '#5A5F7A',
  buttonActive: '#6272A4',

  shadowLight: 'rgba(0, 0, 0, 0.3)',
  shadowMedium: 'rgba(0, 0, 0, 0.5)',
  shadowHeavy: 'rgba(0, 0, 0, 0.7)',

  selection: 'rgba(189, 147, 249, 0.3)',
  focus: '#BD93F9',
  error: '#FF5555',
  warning: '#FFB86C',
  success: '#50FA7B',
}

// Theme presets
export const themePresets: ThemePreset[] = [
  {
    id: 'light',
    name: 'macOS Light',
    description: 'Classic light theme inspired by macOS',
    mode: 'light',
    accentColor: 'blue',
    wallpaper: '/img/ui/wallpaper-day.jpg',
    colors: lightColors,
    effects: {
      blur: 40,
      transparency: 0.8,
      glow: false,
      shadows: true,
      animations: true,
    },
  },
  {
    id: 'dark',
    name: 'macOS Dark',
    description: 'Elegant dark theme for low-light environments',
    mode: 'dark',
    accentColor: 'blue',
    wallpaper: '/img/ui/wallpaper-night.jpg',
    colors: darkColors,
    effects: {
      blur: 40,
      transparency: 0.8,
      glow: false,
      shadows: true,
      animations: true,
    },
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'Maximum contrast for accessibility',
    mode: 'high-contrast',
    accentColor: 'blue',
    wallpaper: '/img/ui/wallpaper-day.jpg',
    colors: highContrastColors,
    effects: {
      blur: 0,
      transparency: 0.95,
      glow: true,
      shadows: true,
      animations: false,
    },
  },
  {
    id: 'oled',
    name: 'OLED Deep Black',
    description: 'True black for OLED displays',
    mode: 'oled',
    accentColor: 'blue',
    wallpaper: '/img/ui/wallpaper-night.jpg',
    colors: oledColors,
    effects: {
      blur: 20,
      transparency: 0.95,
      glow: true,
      shadows: false,
      animations: true,
    },
  },
  {
    id: 'neon-matrix',
    name: 'Neon Matrix',
    description: 'Cyberpunk green matrix aesthetic',
    mode: 'developer',
    accentColor: 'green',
    developerTheme: 'neon-matrix',
    wallpaper: '/img/ui/wallpaper-night.jpg',
    colors: neonMatrixColors,
    effects: {
      blur: 30,
      transparency: 0.95,
      glow: true,
      shadows: true,
      animations: true,
    },
  },
  {
    id: 'monokai-pro',
    name: 'Monokai Pro',
    description: 'Popular code editor theme',
    mode: 'developer',
    accentColor: 'pink',
    developerTheme: 'monokai-pro',
    wallpaper: '/img/ui/wallpaper-night.jpg',
    colors: monokaiProColors,
    effects: {
      blur: 30,
      transparency: 0.95,
      glow: false,
      shadows: true,
      animations: true,
    },
  },
  {
    id: 'dracula-ui',
    name: 'Dracula UI',
    description: 'Dark theme with vibrant colors',
    mode: 'developer',
    accentColor: 'purple',
    developerTheme: 'dracula-ui',
    wallpaper: '/img/ui/wallpaper-night.jpg',
    colors: draculaColors,
    effects: {
      blur: 30,
      transparency: 0.95,
      glow: true,
      shadows: true,
      animations: true,
    },
  },
]

export const getThemePreset = (id: string): ThemePreset | undefined => {
  return themePresets.find(preset => preset.id === id)
}

export const applyAccentColor = (colors: ThemeColors, accent: string): ThemeColors => {
  return {
    ...colors,
    accent,
    primary: accent,
    focus: accent,
  }
}
