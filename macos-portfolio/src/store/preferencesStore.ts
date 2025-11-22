import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { type PreferencesStore } from '@/types'

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    immer(set => ({
      theme: 'auto',
      wallpaper: '/img/ui/wallpaper-day.jpg',
      dockPosition: 'bottom',
      dockSize: 1,
      dockMagnification: 0.5,
      snapToGrid: false,
      gridSize: 20,
      animationScale: 1,
      reduceMotion: false,

      updatePreference: (key, value) => {
        set(state => {
          // @ts-ignore - Dynamic key assignment
          state[key] = value
        })
      },
    })),
    {
      name: 'macos-portfolio-preferences',
      version: 1,
    }
  )
)

// Detect system preference for reduced motion
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
    const { reduceMotion } = usePreferencesStore.getState()
    // Only auto-update if user hasn't manually set a preference
    if (reduceMotion === false && e.matches) {
      usePreferencesStore.getState().updatePreference('reduceMotion', true)
      usePreferencesStore.getState().updatePreference('animationScale', 0.5)
    }
  }

  mediaQuery.addEventListener('change', handleChange)
  handleChange(mediaQuery)
}
