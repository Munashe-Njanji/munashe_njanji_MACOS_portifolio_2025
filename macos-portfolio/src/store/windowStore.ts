import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { AppInstance, AppType, Position, Size, WindowStore } from '@/types'

const BASE_Z_INDEX = 100

export const useWindowStore = create<WindowStore>()(
  immer((set, get) => ({
    windows: [],
    focusedWindowId: null,

    openWindow: (appType: AppType, props?: any) => {
      const id = `${appType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const maxZIndex = Math.max(...get().windows.map(w => w.zIndex), BASE_Z_INDEX)

      // Get active space from spaces store (will be implemented later)
      const activeSpaceId = 'default'

      // Default window sizes based on app type
      const defaultSizes: Record<AppType, Size> = {
        finder: { w: 800, h: 600 },
        pdf: { w: 900, h: 700 },
        safari: { w: 1000, h: 700 },
        text: { w: 700, h: 500 },
        image: { w: 800, h: 600 },
        terminal: { w: 800, h: 500 },
        preferences: { w: 600, h: 500 },
        clipboard: { w: 400, h: 600 },
        github: { w: 1000, h: 700 },
        vscode: { w: 1200, h: 800 },
      }

      // Center window on screen with slight offset for each new window
      const windowCount = get().windows.length
      const offset = (windowCount % 10) * 30
      const menuBarHeight = 24
      const dockHeight = 64
      const availableHeight = window.innerHeight - menuBarHeight - dockHeight
      const centerX = (window.innerWidth - defaultSizes[appType].w) / 2 + offset
      const centerY = menuBarHeight + (availableHeight - defaultSizes[appType].h) / 2 + offset

      const newWindow: AppInstance = {
        id,
        appType,
        zIndex: maxZIndex + 1,
        position: { x: Math.max(0, centerX), y: Math.max(menuBarHeight, centerY) },
        size: defaultSizes[appType],
        state: {
          minimized: false,
          maximized: false,
          focused: true,
        },
        spaceId: activeSpaceId,
        props: props || {},
      }

      set(state => {
        // Unfocus all other windows
        state.windows.forEach(w => {
          w.state.focused = false
        })
        state.windows.push(newWindow)
        state.focusedWindowId = id
      })

      return id
    },

    closeWindow: (id: string) => {
      set(state => {
        const index = state.windows.findIndex(w => w.id === id)
        if (index !== -1) {
          state.windows.splice(index, 1)

          // Focus the next highest window
          if (state.focusedWindowId === id) {
            const sortedWindows = [...state.windows].sort((a, b) => b.zIndex - a.zIndex)
            if (sortedWindows.length > 0) {
              state.focusedWindowId = sortedWindows[0].id
              sortedWindows[0].state.focused = true
            } else {
              state.focusedWindowId = null
            }
          }
        }
      })
    },

    focusWindow: (id: string) => {
      set(state => {
        const window = state.windows.find(w => w.id === id)
        if (window && !window.state.minimized) {
          // Unfocus all windows
          state.windows.forEach(w => {
            w.state.focused = false
          })

          // Focus the target window
          window.state.focused = true
          state.focusedWindowId = id

          // Bring to front
          const maxZIndex = Math.max(...state.windows.map(w => w.zIndex))
          if (window.zIndex < maxZIndex) {
            window.zIndex = maxZIndex + 1
          }
        }
      })
    },

    minimizeWindow: (id: string) => {
      set(state => {
        const window = state.windows.find(w => w.id === id)
        if (window) {
          window.state.minimized = true
          window.state.focused = false

          // Focus next window if this was focused
          if (state.focusedWindowId === id) {
            const visibleWindows = state.windows
              .filter(w => !w.state.minimized && w.id !== id)
              .sort((a, b) => b.zIndex - a.zIndex)

            if (visibleWindows.length > 0) {
              state.focusedWindowId = visibleWindows[0].id
              visibleWindows[0].state.focused = true
            } else {
              state.focusedWindowId = null
            }
          }
        }
      })
    },

    restoreWindow: (id: string) => {
      set(state => {
        const window = state.windows.find(w => w.id === id)
        if (window && window.state.minimized) {
          window.state.minimized = false
          
          // Unfocus all windows
          state.windows.forEach(w => {
            w.state.focused = false
          })

          // Focus the restored window
          window.state.focused = true
          state.focusedWindowId = id

          // Bring to front
          const maxZIndex = Math.max(...state.windows.map(w => w.zIndex))
          if (window.zIndex < maxZIndex) {
            window.zIndex = maxZIndex + 1
          }
        }
      })
    },

    maximizeWindow: (id: string) => {
      set(state => {
        const win = state.windows.find(w => w.id === id)
        if (win) {
          if (win.state.maximized) {
            // Restore to previous size
            win.state.maximized = false
            // Size will be restored by the component that tracks previous size
          } else {
            // Maximize - full height minus menu bar only
            const menuBarHeight = 24
            
            win.state.maximized = true
            win.position = { x: 0, y: menuBarHeight }
            win.size = {
              w: window.innerWidth,
              h: window.innerHeight - menuBarHeight,
            }
          }
        }
      })
    },

    updateWindowPosition: (id: string, position: Position) => {
      set(state => {
        const window = state.windows.find(w => w.id === id)
        if (window && !window.state.maximized) {
          window.position = position
        }
      })
    },

    updateWindowSize: (id: string, size: Size) => {
      set(state => {
        const window = state.windows.find(w => w.id === id)
        if (window && !window.state.maximized) {
          window.size = size
        }
      })
    },

    bringToFront: (id: string) => {
      set(state => {
        const window = state.windows.find(w => w.id === id)
        if (window) {
          const maxZIndex = Math.max(...state.windows.map(w => w.zIndex))
          window.zIndex = maxZIndex + 1
        }
      })
    },
  }))
)
