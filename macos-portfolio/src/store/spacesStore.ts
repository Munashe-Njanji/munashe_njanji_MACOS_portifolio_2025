import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { SpacesStore, Space } from '@/types'

export const useSpacesStore = create<SpacesStore>()(
  immer((set, get) => ({
    spaces: {
      default: {
        id: 'default',
        name: 'Desktop 1',
        windowIds: [],
      },
    },
    activeSpaceId: 'default',

    createSpace: () => {
      const spaceCount = Object.keys(get().spaces).length
      const id = `space-${Date.now()}`

      const newSpace: Space = {
        id,
        name: `Desktop ${spaceCount + 1}`,
        windowIds: [],
      }

      set(state => {
        state.spaces[id] = newSpace
      })

      return id
    },

    deleteSpace: (id: string) => {
      set(state => {
        // Don't delete if it's the last space
        if (Object.keys(state.spaces).length <= 1) {
          return
        }

        // Don't delete the default space
        if (id === 'default') {
          return
        }

        const space = state.spaces[id]
        if (!space) return

        // Move windows to default space
        if (space.windowIds.length > 0) {
          state.spaces.default.windowIds.push(...space.windowIds)
        }

        // Delete the space
        delete state.spaces[id]

        // Switch to default if this was active
        if (state.activeSpaceId === id) {
          state.activeSpaceId = 'default'
        }
      })
    },

    switchSpace: (id: string) => {
      set(state => {
        if (state.spaces[id]) {
          state.activeSpaceId = id
        }
      })
    },

    moveWindowToSpace: (windowId: string, spaceId: string) => {
      set(state => {
        // Remove from all spaces
        Object.values(state.spaces).forEach(space => {
          const index = space.windowIds.indexOf(windowId)
          if (index !== -1) {
            space.windowIds.splice(index, 1)
          }
        })

        // Add to target space
        if (state.spaces[spaceId]) {
          state.spaces[spaceId].windowIds.push(windowId)
        }
      })
    },
  }))
)
