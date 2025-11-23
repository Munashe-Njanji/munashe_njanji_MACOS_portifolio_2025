import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { ThemeMode, AccentColor, DeveloperTheme, ThemeConfig } from '@/types/theme'
import {
  getInitialTheme,
  getInitialAccentColor,
  getInitialDeveloperTheme,
  buildThemeConfig,
  applyThemeToDocument,
  saveThemeToCookie,
  watchSystemTheme,
} from '@/utils/themeUtils'

export interface PreferencesStore {
  // Theme
  themeMode: ThemeMode
  accentColor: AccentColor
  developerTheme?: DeveloperTheme
  currentTheme: ThemeConfig

  // Legacy
  theme: 'light' | 'dark' | 'auto'
  wallpaper: string
  dockPosition: 'bottom' | 'left' | 'right'
  dockSize: number
  dockMagnification: number
  snapToGrid: boolean
  gridSize: number
  animationScale: number
  reduceMotion: boolean

  // Actions
  setThemeMode: (mode: ThemeMode) => void
  setAccentColor: (color: AccentColor) => void
  setDeveloperTheme: (theme: DeveloperTheme) => void
  applyTheme: () => void
  updatePreference: <K extends keyof Omit<PreferencesStore, 'updatePreference' | 'setThemeMode' | 'setAccentColor' | 'setDeveloperTheme' | 'applyTheme' | 'currentTheme'>>(
    key: K,
    value: PreferencesStore[K]
  ) => void
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    immer(set => {
      // Initialize theme from cookie or system
      const initialMode = getInitialTheme()
      const initialAccent = getInitialAccentColor()
      const initialDevTheme = getInitialDeveloperTheme()
      const initialConfig = buildThemeConfig(initialMode, initialAccent, initialDevTheme)

      return {
        themeMode: initialMode,
        accentColor: initialAccent,
        developerTheme: initialDevTheme,
        currentTheme: initialConfig,

        theme: 'auto',
        wallpaper: initialConfig.wallpaper,
        dockPosition: 'bottom',
        dockSize: 1,
        dockMagnification: 0.5,
        snapToGrid: false,
        gridSize: 20,
        animationScale: 1,
        reduceMotion: false,

        setThemeMode: mode => {
          set(state => {
            state.themeMode = mode
            state.currentTheme = buildThemeConfig(mode, state.accentColor, state.developerTheme)
            state.wallpaper = state.currentTheme.wallpaper

            // Save to cookie
            saveThemeToCookie({
              mode,
              accentColor: state.accentColor,
              developerTheme: state.developerTheme,
            })

            // Apply to document
            applyThemeToDocument(state.currentTheme)
          })
        },

        setAccentColor: color => {
          set(state => {
            state.accentColor = color
            state.currentTheme = buildThemeConfig(
              state.themeMode,
              color,
              state.developerTheme
            )

            // Save to cookie
            saveThemeToCookie({
              mode: state.themeMode,
              accentColor: color,
              developerTheme: state.developerTheme,
            })

            // Apply to document
            applyThemeToDocument(state.currentTheme)
          })
        },

        setDeveloperTheme: theme => {
          set(state => {
            state.developerTheme = theme
            state.themeMode = 'developer'
            state.currentTheme = buildThemeConfig('developer', state.accentColor, theme)
            state.wallpaper = state.currentTheme.wallpaper

            // Save to cookie
            saveThemeToCookie({
              mode: 'developer',
              accentColor: state.accentColor,
              developerTheme: theme,
            })

            // Apply to document
            applyThemeToDocument(state.currentTheme)
          })
        },

        applyTheme: () => {
          const state = usePreferencesStore.getState()
          applyThemeToDocument(state.currentTheme)
        },

        updatePreference: (key, value) => {
          set(state => {
            // @ts-ignore - Dynamic key assignment
            state[key] = value
          })
        },
      }
    }),
    {
      name: 'macos-portfolio-preferences',
      version: 2,
    }
  )
)

// Initialize theme system
if (typeof window !== 'undefined') {
  // Apply initial theme
  const initialState = usePreferencesStore.getState()
  applyThemeToDocument(initialState.currentTheme)

  // Watch for system theme changes (only if mode is 'auto')
  watchSystemTheme(systemTheme => {
    const state = usePreferencesStore.getState()
    if (state.themeMode === 'auto') {
      const newMode = systemTheme === 'dark' ? 'dark' : 'light'
      const newConfig = buildThemeConfig(newMode, state.accentColor, state.developerTheme)
      usePreferencesStore.setState({ currentTheme: newConfig })
      applyThemeToDocument(newConfig)
    }
  })

  // Detect system preference for reduced motion
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  const handleMotionChange = (e: MediaQueryListEvent | MediaQueryList) => {
    const { reduceMotion } = usePreferencesStore.getState()
    // Only auto-update if user hasn't manually set a preference
    if (reduceMotion === false && e.matches) {
      usePreferencesStore.getState().updatePreference('reduceMotion', true)
      usePreferencesStore.getState().updatePreference('animationScale', 0.5)
    }
  }

  motionQuery.addEventListener('change', handleMotionChange)
  handleMotionChange(motionQuery)
}
