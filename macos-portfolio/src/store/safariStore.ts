import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface Bookmark {
  id: string
  title: string
  url: string
  createdAt: number
}

export interface SafariStore {
  bookmarks: Bookmark[]
  addBookmark: (title: string, url: string) => void
  removeBookmark: (id: string) => void
  isBookmarked: (url: string) => boolean
}

export const useSafariStore = create<SafariStore>()(
  persist(
    immer((set, get) => ({
      bookmarks: [],

      addBookmark: (title: string, url: string) => {
        set(state => {
          // Check if already bookmarked
          const exists = state.bookmarks.some(b => b.url === url)
          if (!exists) {
            state.bookmarks.push({
              id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title,
              url,
              createdAt: Date.now(),
            })
          }
        })
      },

      removeBookmark: (id: string) => {
        set(state => {
          const index = state.bookmarks.findIndex(b => b.id === id)
          if (index !== -1) {
            state.bookmarks.splice(index, 1)
          }
        })
      },

      isBookmarked: (url: string) => {
        return get().bookmarks.some(b => b.url === url)
      },
    })),
    {
      name: 'macos-portfolio-safari',
      version: 1,
    }
  )
)
