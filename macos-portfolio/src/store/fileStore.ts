import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { FileNode, FileContent, FileStore } from '@/types'
import { getNotificationEventSystem } from '@/utils/notificationEvents'

export const useFileStore = create<FileStore>()(
  immer((set, get) => ({
    files: {},
    fileContents: {},

    createFile: (parentId: string | null, name: string, type: 'file' | 'folder') => {
      const id = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
      const now = Date.now()

      const newFile: FileNode = {
        id,
        name,
        type,
        parentId,
        createdAt: now,
        updatedAt: now,
        metadata: {},
      }

      if (type === 'file') {
        // Determine mime type from extension
        const ext = name.split('.').pop()?.toLowerCase()
        const mimeTypes: Record<string, string> = {
          txt: 'text/plain',
          md: 'text/markdown',
          pdf: 'application/pdf',
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif',
          svg: 'image/svg+xml',
        }
        newFile.mimeType = mimeTypes[ext || ''] || 'application/octet-stream'
        newFile.size = 0
      }

      set(state => {
        state.files[id] = newFile
      })

      // Trigger notification
      try {
        const notificationSystem = getNotificationEventSystem()
        notificationSystem.onFileCreated(name, type)
      } catch (e) {
        // Notification system not initialized yet
      }

      return id
    },

    readFile: async (id: string) => {
      const content = get().fileContents[id]
      if (content) {
        return content
      }

      // If not in memory, try to load from IndexedDB (will be implemented in persistence layer)
      // For now, return empty content
      const emptyContent: FileContent = {
        fileId: id,
        content: '',
      }

      set(state => {
        state.fileContents[id] = emptyContent
      })

      return emptyContent
    },

    updateFile: (id: string, updates: Partial<FileNode>) => {
      set(state => {
        const file = state.files[id]
        if (file) {
          Object.assign(file, updates)
          file.updatedAt = Date.now()
        }
      })
    },

    updateFileContent: (id: string, content: Blob | string) => {
      set(state => {
        const file = state.files[id]
        if (file) {
          state.fileContents[id] = {
            fileId: id,
            content,
          }

          // Update file size
          if (typeof content === 'string') {
            file.size = new Blob([content]).size
          } else {
            file.size = content.size
          }

          file.updatedAt = Date.now()
        }
      })
    },

    deleteFile: (id: string) => {
      set(state => {
        const file = state.files[id]
        if (!file) return

        // If it's a folder, recursively delete all children
        if (file.type === 'folder') {
          const deleteRecursive = (folderId: string) => {
            const children = Object.values(state.files).filter(f => f.parentId === folderId)
            children.forEach(child => {
              if (child.type === 'folder') {
                deleteRecursive(child.id)
              }
              delete state.files[child.id]
              delete state.fileContents[child.id]
            })
          }
          deleteRecursive(id)
        }

        // Delete the file/folder itself
        delete state.files[id]
        delete state.fileContents[id]
      })
    },

    moveFile: (id: string, newParentId: string) => {
      set(state => {
        const file = state.files[id]
        if (file) {
          file.parentId = newParentId
          file.updatedAt = Date.now()
        }
      })
    },

    renameFile: (id: string, newName: string) => {
      set(state => {
        const file = state.files[id]
        if (file) {
          file.name = newName
          file.updatedAt = Date.now()

          // Update mime type if it's a file and extension changed
          if (file.type === 'file') {
            const ext = newName.split('.').pop()?.toLowerCase()
            const mimeTypes: Record<string, string> = {
              txt: 'text/plain',
              md: 'text/markdown',
              pdf: 'application/pdf',
              jpg: 'image/jpeg',
              jpeg: 'image/jpeg',
              png: 'image/png',
              gif: 'image/gif',
              svg: 'image/svg+xml',
            }
            file.mimeType = mimeTypes[ext || ''] || 'application/octet-stream'
          }
        }
      })
    },

    getFileTree: (parentId?: string) => {
      const files = Object.values(get().files)
      return files
        .filter(f => f.parentId === (parentId || null))
        .sort((a, b) => {
          // Folders first, then files
          if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1
          }
          // Then alphabetically
          return a.name.localeCompare(b.name)
        })
    },
  }))
)

// Initialize with some default folders
useFileStore.setState(state => {
  const now = Date.now()

  // Root folders
  const documentsId = 'folder-documents'
  const desktopId = 'folder-desktop'
  const downloadsId = 'folder-downloads'

  state.files[documentsId] = {
    id: documentsId,
    name: 'Documents',
    type: 'folder',
    parentId: null,
    createdAt: now,
    updatedAt: now,
    metadata: { icon: '📄' },
  }

  state.files[desktopId] = {
    id: desktopId,
    name: 'Desktop',
    type: 'folder',
    parentId: null,
    createdAt: now,
    updatedAt: now,
    metadata: { icon: '🖥️' },
  }

  state.files[downloadsId] = {
    id: downloadsId,
    name: 'Downloads',
    type: 'folder',
    parentId: null,
    createdAt: now,
    updatedAt: now,
    metadata: { icon: '⬇️' },
  }

  // Sample files in Documents
  const readmeId = 'file-readme'
  state.files[readmeId] = {
    id: readmeId,
    name: 'README.md',
    type: 'file',
    mimeType: 'text/markdown',
    size: 0,
    parentId: documentsId,
    createdAt: now,
    updatedAt: now,
    metadata: {},
  }

  state.fileContents[readmeId] = {
    fileId: readmeId,
    content: `# Welcome to macOS Portfolio

This is a demo portfolio application built with React, TypeScript, and Tailwind CSS.

## Features

- 🖥️ macOS-style desktop environment
- 📁 File management with Finder
- 📄 PDF viewer for resume
- 🌐 Safari-like web browser
- ✏️ Text editor
- 🖼️ Image viewer
- 💻 Terminal with file system integration
- 🔍 Spotlight search
- 🔔 Notification center
- 🪟 Mission Control with multiple spaces

Enjoy exploring!
`,
  }

  // Sample text file
  const notesId = 'file-notes'
  state.files[notesId] = {
    id: notesId,
    name: 'Notes.txt',
    type: 'file',
    mimeType: 'text/plain',
    size: 0,
    parentId: documentsId,
    createdAt: now,
    updatedAt: now,
    metadata: {},
  }

  state.fileContents[notesId] = {
    fileId: notesId,
    content: `Project Notes
=============

- Implement file opening logic ✓
- Add drag and drop support ✓
- Create context menus ✓
- Test file operations ✓

Next steps:
- Implement PDF viewer
- Implement text editor
- Implement image viewer
`,
  }

  // Sample subfolder in Documents
  const projectsId = 'folder-projects'
  state.files[projectsId] = {
    id: projectsId,
    name: 'Projects',
    type: 'folder',
    parentId: documentsId,
    createdAt: now,
    updatedAt: now,
    metadata: { icon: '💼' },
  }

  // Sample file in Projects folder
  const todoId = 'file-todo'
  state.files[todoId] = {
    id: todoId,
    name: 'TODO.md',
    type: 'file',
    mimeType: 'text/markdown',
    size: 0,
    parentId: projectsId,
    createdAt: now,
    updatedAt: now,
    metadata: {},
  }

  state.fileContents[todoId] = {
    fileId: todoId,
    content: `# TODO List

## High Priority
- [ ] Complete Finder implementation
- [ ] Add PDF viewer
- [ ] Add text editor

## Medium Priority
- [ ] Add image viewer
- [ ] Add Terminal
- [ ] Add Safari browser

## Low Priority
- [ ] Add system preferences
- [ ] Add clipboard manager
`,
  }

  // Sample PDF file (placeholder - in real app would be actual PDF)
  const resumeId = 'file-resume-pdf'
  state.files[resumeId] = {
    id: resumeId,
    name: 'Resume.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    size: 0,
    parentId: documentsId,
    createdAt: now,
    updatedAt: now,
    metadata: {},
  }

  // Note: In a real application, this would be actual PDF binary data
  // For now, we'll use a placeholder that indicates PDF viewer is working
  state.fileContents[resumeId] = {
    fileId: resumeId,
    content: 'PDF_PLACEHOLDER', // In production, this would be a Blob or base64 string
  }

  // Sample image files
  const picturesId = 'folder-pictures'
  state.files[picturesId] = {
    id: picturesId,
    name: 'Pictures',
    type: 'folder',
    parentId: null,
    createdAt: now,
    updatedAt: now,
    metadata: { icon: '🖼️' },
  }

  // Sample image 1
  const image1Id = 'file-sample-image-1'
  state.files[image1Id] = {
    id: image1Id,
    name: 'Wallpaper.jpg',
    type: 'file',
    mimeType: 'image/jpeg',
    size: 0,
    parentId: picturesId,
    createdAt: now,
    updatedAt: now,
    metadata: {},
  }

  // Using a placeholder gradient as image content
  state.fileContents[image1Id] = {
    fileId: image1Id,
    content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2NjdlZWE7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3NjRiYTI7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==',
  }

  // Sample image 2
  const image2Id = 'file-sample-image-2'
  state.files[image2Id] = {
    id: image2Id,
    name: 'Screenshot.png',
    type: 'file',
    mimeType: 'image/png',
    size: 0,
    parentId: picturesId,
    createdAt: now,
    updatedAt: now,
    metadata: {},
  }

  state.fileContents[image2Id] = {
    fileId: image2Id,
    content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmY3MTcwO3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmZiNDZhO3N0b3Atb3BhY2l0eToxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=',
  }
})
