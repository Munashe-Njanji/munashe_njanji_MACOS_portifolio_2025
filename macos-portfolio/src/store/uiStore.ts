import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { UIStore, MenuItem } from '@/types'

export const useUIStore = create<UIStore>()(
  immer(set => ({
    spotlightOpen: false,
    notificationCenterOpen: false,
    missionControlActive: false,
    contextMenu: null,

    toggleSpotlight: () => {
      set(state => {
        state.spotlightOpen = !state.spotlightOpen
        // Close other overlays when opening spotlight
        if (state.spotlightOpen) {
          state.notificationCenterOpen = false
          state.missionControlActive = false
          state.contextMenu = null
        }
      })
    },

    toggleNotificationCenter: () => {
      set(state => {
        state.notificationCenterOpen = !state.notificationCenterOpen
        // Close other overlays
        if (state.notificationCenterOpen) {
          state.spotlightOpen = false
          state.contextMenu = null
        }
      })
    },

    activateMissionControl: () => {
      set(state => {
        state.missionControlActive = true
        // Close other overlays
        state.spotlightOpen = false
        state.notificationCenterOpen = false
        state.contextMenu = null
      })
    },

    deactivateMissionControl: () => {
      set(state => {
        state.missionControlActive = false
      })
    },

    showContextMenu: (x: number, y: number, items: MenuItem[]) => {
      set(state => {
        state.contextMenu = { x, y, items }
      })
    },

    hideContextMenu: () => {
      set(state => {
        state.contextMenu = null
      })
    },
  }))
)
