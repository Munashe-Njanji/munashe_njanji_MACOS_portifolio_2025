import type { ThemeMode, AccentColor, DeveloperTheme, ThemeConfig } from '@/types/theme'
import { themePresets, accentColors, applyAccentColor } from './themePresets'

// Cookie utilities
export const THEME_COOKIE_NAME = 'macos-portfolio-theme'
export const THEME_COOKIE_EXPIRY_DAYS = 365

export const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

export const getCookie = (name: string): string | null => {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

// System theme detection
export const detectSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

// Watch for system theme changes
export const watchSystemTheme = (callback: (theme: 'light' | 'dark') => void) => {
  if (typeof window === 'undefined') return () => {}

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light')
  }

  mediaQuery.addEventListener('change', handler)

  return () => {
    mediaQuery.removeEventListener('change', handler)
  }
}

// Save theme to cookie
export const saveThemeToCookie = (config: Partial<ThemeConfig>) => {
  const themeData = JSON.stringify(config)
  setCookie(THEME_COOKIE_NAME, themeData, THEME_COOKIE_EXPIRY_DAYS)
}

// Load theme from cookie
export const loadThemeFromCookie = (): Partial<ThemeConfig> | null => {
  const cookieValue = getCookie(THEME_COOKIE_NAME)
  if (!cookieValue) return null

  try {
    return JSON.parse(cookieValue)
  } catch (error) {
    console.error('Failed to parse theme cookie:', error)
    return null
  }
}

// Get initial theme (priority: cookie > system > default)
export const getInitialTheme = (): ThemeMode => {
  const savedTheme = loadThemeFromCookie()
  if (savedTheme?.mode) {
    return savedTheme.mode
  }

  // Check if user prefers dark mode
  const systemTheme = detectSystemTheme()
  return systemTheme === 'dark' ? 'dark' : 'light'
}

// Get initial accent color
export const getInitialAccentColor = (): AccentColor => {
  const savedTheme = loadThemeFromCookie()
  return (savedTheme?.accentColor as AccentColor) || 'blue'
}

// Get initial developer theme
export const getInitialDeveloperTheme = (): DeveloperTheme | undefined => {
  const savedTheme = loadThemeFromCookie()
  return savedTheme?.developerTheme as DeveloperTheme | undefined
}

// Apply theme to document
export const applyThemeToDocument = (config: ThemeConfig) => {
  const root = document.documentElement

  // Apply CSS custom properties
  Object.entries(config.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value)
  })

  // Apply effects
  root.style.setProperty('--theme-blur', `${config.effects.blur}px`)
  root.style.setProperty('--theme-transparency', config.effects.transparency.toString())

  // Apply data attributes for CSS selectors
  root.setAttribute('data-theme', config.mode)
  root.setAttribute('data-accent', config.accentColor)
  if (config.developerTheme) {
    root.setAttribute('data-developer-theme', config.developerTheme)
  } else {
    root.removeAttribute('data-developer-theme')
  }

  // Apply effects flags
  root.setAttribute('data-glow', config.effects.glow.toString())
  root.setAttribute('data-shadows', config.effects.shadows.toString())
  root.setAttribute('data-animations', config.effects.animations.toString())
}

// Build theme config from mode and accent
export const buildThemeConfig = (
  mode: ThemeMode,
  accentColor: AccentColor,
  developerTheme?: DeveloperTheme
): ThemeConfig => {
  // Find preset
  let preset = themePresets.find(p => p.mode === mode)

  // If developer theme, find specific preset
  if (mode === 'developer' && developerTheme) {
    preset = themePresets.find(p => p.developerTheme === developerTheme)
  }

  // Fallback to light theme
  if (!preset) {
    preset = themePresets[0]
  }

  // Apply accent color
  const colors = applyAccentColor(preset.colors, accentColors[accentColor])

  return {
    mode,
    accentColor,
    developerTheme,
    colors,
    wallpaper: preset.wallpaper,
    effects: preset.effects,
  }
}

// Resolve auto theme
export const resolveAutoTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'auto') {
    return detectSystemTheme()
  }
  return mode === 'light' ? 'light' : 'dark'
}
