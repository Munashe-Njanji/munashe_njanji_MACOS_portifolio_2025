import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { SpotlightStore, SearchResult, AppType } from '@/types'

// Weighted scoring algorithm for search results
const calculateScore = (
  query: string,
  text: string,
  type: 'app' | 'file' | 'bookmark' | 'command' | 'setting'
): number => {
  const lowerQuery = query.toLowerCase()
  const lowerText = text.toLowerCase()

  let score = 0

  // Exact match (highest priority)
  if (lowerText === lowerQuery) {
    score += 1000
  }

  // Starts with query (high priority)
  if (lowerText.startsWith(lowerQuery)) {
    score += 500
  }

  // Contains query (medium priority)
  if (lowerText.includes(lowerQuery)) {
    score += 100
  }

  // Word boundary match (bonus)
  const words = lowerText.split(/\s+/)
  if (words.some(word => word.startsWith(lowerQuery))) {
    score += 200
  }

  // Type-based weighting
  const typeWeights = {
    app: 1.5,
    file: 1.0,
    bookmark: 0.8,
    command: 1.2,
    setting: 0.9,
  }
  score *= typeWeights[type]

  // Penalize longer matches (prefer shorter, more specific results)
  const lengthPenalty = Math.max(0, (text.length - query.length) / 100)
  score -= lengthPenalty

  return Math.max(0, score)
}

export const useSpotlightStore = create<SpotlightStore>()(
  immer((set, get) => ({
    index: {
      files: new Map(),
      apps: new Map([
        ['finder', { name: 'Finder', type: 'finder' as AppType }],
        ['safari', { name: 'Safari', type: 'safari' as AppType }],
        ['pdf', { name: 'PDF Viewer', type: 'pdf' as AppType }],
        ['text', { name: 'Text Editor', type: 'text' as AppType }],
        ['image', { name: 'Image Viewer', type: 'image' as AppType }],
        ['terminal', { name: 'Terminal', type: 'terminal' as AppType }],
        ['preferences', { name: 'System Preferences', type: 'preferences' as AppType }],
        ['clipboard', { name: 'Clipboard Manager', type: 'clipboard' as AppType }],
      ]),
      bookmarks: new Map(),
      commands: new Map(),
      settings: new Map(),
    },
    recentSearches: [],
    query: '',
    results: [],

    setQuery: (query: string) => {
      set(state => {
        state.query = query
      })
    },

    search: (query: string) => {
      if (!query.trim()) {
        set(state => {
          state.results = []
        })
        return
      }

      const results: SearchResult[] = []
      const { index } = get()

      // Search apps
      index.apps.forEach((app, id) => {
        const score = calculateScore(query, app.name, 'app')
        if (score > 0) {
          const iconMap: Record<string, string> = {
            finder: '📁',
            safari: '🌐',
            pdf: '📕',
            text: '📝',
            image: '🖼️',
            terminal: '💻',
            preferences: '⚙️',
            clipboard: '📋',
          }

          results.push({
            id: `app-${id}`,
            type: 'app',
            title: app.name,
            subtitle: 'Application',
            icon: iconMap[app.type] || '📱',
            score,
            action: () => {
              // Will be implemented when window store is integrated
              console.log('Open app:', app.type)
            },
          })
        }
      })

      // Search files
      index.files.forEach((file, id) => {
        const score = calculateScore(query, file.name, 'file')
        if (score > 0) {
          const iconMap: Record<string, string> = {
            folder: '📁',
            'text/plain': '📄',
            'text/markdown': '📝',
            'application/pdf': '📕',
            'image/jpeg': '🖼️',
            'image/png': '🖼️',
            'image/gif': '🖼️',
          }

          results.push({
            id: `file-${id}`,
            type: 'file',
            title: file.name,
            subtitle: file.type === 'folder' ? 'Folder' : file.mimeType || 'File',
            icon: iconMap[file.type === 'folder' ? 'folder' : file.mimeType || ''] || '📄',
            score,
            action: () => {
              console.log('Open file:', file.id)
            },
          })
        }
      })

      // Search bookmarks
      index.bookmarks.forEach((bookmark, id) => {
        const titleScore = calculateScore(query, bookmark.title, 'bookmark')
        const urlScore = calculateScore(query, bookmark.url, 'bookmark') * 0.5 // URL matches are less important

        const score = Math.max(titleScore, urlScore)
        if (score > 0) {
          results.push({
            id: `bookmark-${id}`,
            type: 'bookmark',
            title: bookmark.title,
            subtitle: bookmark.url,
            icon: '🔖',
            score,
            action: () => {
              console.log('Open bookmark:', bookmark.url)
            },
          })
        }
      })

      // Search commands
      index.commands.forEach((command, id) => {
        const score = calculateScore(query, command.name, 'command')
        if (score > 0) {
          results.push({
            id: `command-${id}`,
            type: 'command',
            title: command.name,
            subtitle: command.description || 'Command',
            icon: '⚡',
            score,
            action: command.action,
          })
        }
      })

      // Search settings
      index.settings.forEach((setting, id) => {
        const score = calculateScore(query, setting.name, 'setting')
        if (score > 0) {
          results.push({
            id: `setting-${id}`,
            type: 'setting',
            title: setting.name,
            subtitle: 'System Preference',
            icon: '⚙️',
            score,
            action: () => {
              console.log('Open setting:', setting.id)
            },
          })
        }
      })

      // Sort by score (highest first)
      results.sort((a, b) => b.score - a.score)

      // Limit to top 10 results
      const topResults = results.slice(0, 10)

      set(state => {
        state.results = topResults
      })

      // Add to recent searches if query is meaningful
      if (query.length >= 2) {
        get().addToRecent(query)
      }
    },

    rebuildIndex: (files?: Map<string, any>) => {
      set(state => {
        // Rebuild file index from file store
        if (files) {
          state.index.files = new Map(files)
        } else {
          state.index.files.clear()
        }
      })
    },

    addFileToIndex: (fileId: string, file: any) => {
      set(state => {
        state.index.files.set(fileId, file)
      })
    },

    removeFileFromIndex: (fileId: string) => {
      set(state => {
        state.index.files.delete(fileId)
      })
    },

    addBookmarkToIndex: (bookmarkId: string, bookmark: any) => {
      set(state => {
        state.index.bookmarks.set(bookmarkId, bookmark)
      })
    },

    removeBookmarkFromIndex: (bookmarkId: string) => {
      set(state => {
        state.index.bookmarks.delete(bookmarkId)
      })
    },

    addToRecent: (query: string) => {
      set(state => {
        // Remove if already exists
        const index = state.recentSearches.indexOf(query)
        if (index !== -1) {
          state.recentSearches.splice(index, 1)
        }

        // Add to beginning
        state.recentSearches.unshift(query)

        // Limit to 10 recent searches
        if (state.recentSearches.length > 10) {
          state.recentSearches = state.recentSearches.slice(0, 10)
        }
      })
    },
  }))
)
