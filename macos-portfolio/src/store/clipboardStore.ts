import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useFileStore } from './fileStore'

export interface ClipboardEntry {
  id: string
  content: string
  timestamp: number
  type: 'text' | 'html' | 'image'
}

export interface ClipboardStore {
  entries: ClipboardEntry[]
  maxEntries: number
  syncToFinder: boolean
  clipboardFolderId: string | null

  // Actions
  addEntry: (content: string, type?: 'text' | 'html' | 'image') => void
  clearHistory: () => void
  removeEntry: (id: string) => void
  toggleFinderSync: () => void
  initializeClipboardFolder: () => void
}

export const useClipboardStore = create<ClipboardStore>()(
  immer((set, get) => ({
    entries: [],
    maxEntries: 50,
    syncToFinder: false,
    clipboardFolderId: null,

    initializeClipboardFolder: () => {
      const fileStore = useFileStore.getState()
      
      // Check if clipboard folder exists
      const existingFolder = Object.values(fileStore.files).find(
        file => file.name === 'Clipboard' && file.type === 'folder' && file.parentId === null
      )

      if (existingFolder) {
        set(state => {
          state.clipboardFolderId = existingFolder.id
        })
      } else {
        // Create clipboard folder
        const folderId = fileStore.createFile(null, 'Clipboard', 'folder')
        set(state => {
          state.clipboardFolderId = folderId
        })
      }
    },

    addEntry: (content: string, type: 'text' | 'html' | 'image' = 'text') => {
      const entry: ClipboardEntry = {
        id: `clip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content,
        timestamp: Date.now(),
        type,
      }

      set(state => {
        // Add to beginning of array
        state.entries.unshift(entry)

        // Limit to maxEntries
        if (state.entries.length > state.maxEntries) {
          state.entries = state.entries.slice(0, state.maxEntries)
        }
      })

      // If syncToFinder is enabled, save to file system
      const state = get()
      if (state.syncToFinder && state.clipboardFolderId) {
        const fileStore = useFileStore.getState()
        const timestamp = new Date(entry.timestamp).toISOString().replace(/[:.]/g, '-')
        const fileName = `clipboard-${timestamp}.txt`
        
        try {
          const fileId = fileStore.createFile(state.clipboardFolderId, fileName, 'file')
          fileStore.updateFileContent(fileId, content)
        } catch (err) {
          console.error('Failed to sync clipboard to Finder:', err)
        }
      }
    },

    clearHistory: () => {
      set(state => {
        state.entries = []
      })
    },

    removeEntry: (id: string) => {
      set(state => {
        state.entries = state.entries.filter(entry => entry.id !== id)
      })
    },

    toggleFinderSync: () => {
      set(state => {
        state.syncToFinder = !state.syncToFinder
      })
    },
  }))
)
