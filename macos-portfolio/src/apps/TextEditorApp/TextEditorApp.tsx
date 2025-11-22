import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { history } from '@milkdown/plugin-history'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react'
import { nord } from '@milkdown/theme-nord'
import type { TextEditorAppProps } from '@/types/components'
import { useFileStore, useUIStore } from '@/store'
import type { MenuItem } from '@/types'
import '@milkdown/theme-nord/style.css'

const MilkdownEditor: React.FC<{
  content: string
  onChange: (markdown: string) => void
  onSave: () => void
  onNew: () => void
}> = ({ content, onChange, onSave, onNew }) => {
  useEditor(root =>
    Editor.make()
      .config(ctx => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, content)
        ctx.get(listenerCtx).markdownUpdated((_ctx, markdown) => {
          onChange(markdown)
        })
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(listener)
  )

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+S or Ctrl+S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        onSave()
      }
      // Cmd+N or Ctrl+N to create new file
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        onNew()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onSave, onNew])

  return <Milkdown />
}

export const TextEditorApp: React.FC<TextEditorAppProps> = ({ appInstance }) => {
  const { files, fileContents, updateFileContent, createFile, deleteFile, renameFile } =
    useFileStore()
  const { showContextMenu } = useUIStore()
  const [isSaved, setIsSaved] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [currentFileId, setCurrentFileId] = useState<string | null>(
    appInstance.props?.fileId || null
  )
  const [isRenaming, setIsRenaming] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const contentRef = useRef<string>('')

  const fileId = currentFileId
  const file = fileId ? files[fileId] : null
  const fileContent = fileId ? fileContents[fileId] : null

  // Initialize content
  const initialContent =
    typeof fileContent?.content === 'string'
      ? fileContent.content
      : '# Welcome to Text Editor\n\nStart typing your markdown here...'

  useEffect(() => {
    contentRef.current = initialContent
  }, [initialContent])

  // Handle save
  const handleSave = useCallback(() => {
    if (fileId && contentRef.current) {
      updateFileContent(fileId, contentRef.current)
      setIsSaved(true)
      setLastSaved(new Date())

      // Clear autosave timer
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
    }
  }, [fileId, updateFileContent])

  // Handle content change
  const handleChange = useCallback(
    (markdown: string) => {
      contentRef.current = markdown
      setIsSaved(false)

      // Clear existing autosave timer
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }

      // Set new autosave timer (5 seconds)
      autosaveTimerRef.current = setTimeout(() => {
        handleSave()
      }, 5000)
    },
    [handleSave]
  )

  // Cleanup autosave timer on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
    }
  }, [])

  // Handle new file creation
  const handleNewFile = useCallback(() => {
    // Save current file if unsaved
    if (!isSaved && fileId) {
      handleSave()
    }

    // Create new file in Documents folder
    const documentsFolder = Object.values(files).find(
      f => f.name === 'Documents' && f.type === 'folder' && f.parentId === null
    )
    const parentId = documentsFolder?.id || null

    const newFileId = createFile(parentId, 'Untitled.md', 'file')
    updateFileContent(newFileId, '# New Document\n\nStart typing here...')
    setCurrentFileId(newFileId)
    setIsSaved(true)
    setLastSaved(new Date())
    contentRef.current = '# New Document\n\nStart typing here...'
  }, [isSaved, fileId, handleSave, files, createFile, updateFileContent])

  // Handle file deletion
  const handleDeleteFile = useCallback(() => {
    if (!fileId || !file) return

    const confirmDelete = window.confirm(`Are you sure you want to delete "${file.name}"?`)
    if (confirmDelete) {
      deleteFile(fileId)
      setCurrentFileId(null)
      contentRef.current = ''
    }
  }, [fileId, file, deleteFile])

  // Handle file rename
  const handleRename = useCallback(() => {
    if (!file) return
    setNewFileName(file.name)
    setIsRenaming(true)
  }, [file])

  const handleRenameSubmit = useCallback(() => {
    if (!fileId || !newFileName.trim()) {
      setIsRenaming(false)
      return
    }

    renameFile(fileId, newFileName.trim())
    setIsRenaming(false)
  }, [fileId, newFileName, renameFile])

  const handleRenameCancel = useCallback(() => {
    setIsRenaming(false)
    setNewFileName('')
  }, [])

  // Handle context menu
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation() // Prevent event from bubbling to desktop

      if (!file) return

      const menuItems: MenuItem[] = [
        {
          id: 'file-info',
          label: 'File Information',
          icon: 'ℹ️',
          action: () => {
            const size = file.size || 0
            const sizeKB = (size / 1024).toFixed(2)
            const created = new Date(file.createdAt).toLocaleString()
            const modified = new Date(file.updatedAt).toLocaleString()
            const wordCount = contentRef.current.split(/\s+/).filter(Boolean).length
            const lineCount = contentRef.current.split('\n').length

            alert(
              `File: ${file.name}\n` +
                `Type: ${file.mimeType || 'Unknown'}\n` +
                `Size: ${sizeKB} KB\n` +
                `Words: ${wordCount}\n` +
                `Lines: ${lineCount}\n` +
                `Created: ${created}\n` +
                `Modified: ${modified}`
            )
          },
        },
        {
          id: 'separator-1',
          label: '',
          separator: true,
          action: () => {},
        },
        {
          id: 'new-file',
          label: 'New File',
          icon: '📄',
          action: handleNewFile,
        },
        {
          id: 'save',
          label: 'Save',
          icon: '💾',
          action: handleSave,
          disabled: isSaved,
        },
        {
          id: 'rename',
          label: 'Rename',
          icon: '✏️',
          action: handleRename,
        },
        {
          id: 'separator-2',
          label: '',
          separator: true,
          action: () => {},
        },
        {
          id: 'delete',
          label: 'Delete File',
          icon: '🗑️',
          action: handleDeleteFile,
        },
      ]

      showContextMenu(e.clientX, e.clientY, menuItems)
    },
    [file, isSaved, handleNewFile, handleSave, handleRename, handleDeleteFile, showContextMenu]
  )

  if (!file) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-600 mb-6">No file loaded</p>
          <button
            onClick={handleNewFile}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Create New File
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-white" onContextMenu={handleContextMenu}>
      {/* Toolbar */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-gray-300 bg-gray-50">
        <div className="flex items-center space-x-3">
          {isRenaming ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newFileName}
                onChange={e => setNewFileName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleRenameSubmit()
                  if (e.key === 'Escape') handleRenameCancel()
                }}
                className="px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleRenameSubmit}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ✓
              </button>
              <button
                onClick={handleRenameCancel}
                className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <span className="text-sm font-medium text-gray-700">{file.name}</span>
              <button
                onClick={handleRename}
                className="text-xs text-gray-500 hover:text-gray-700"
                title="Rename file"
              >
                ✏️
              </button>
            </>
          )}
          {!isSaved && <span className="text-xs text-orange-500">● Unsaved</span>}
          {isSaved && lastSaved && (
            <span className="text-xs text-gray-500">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleNewFile}
            className="px-3 py-1 text-sm bg-green-500 text-white hover:bg-green-600 rounded transition-colors"
            title="New file (Cmd+N)"
          >
            New
          </button>
          <button
            onClick={handleSave}
            disabled={isSaved}
            className="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="Save (Cmd+S)"
          >
            Save
          </button>
          <button
            onClick={handleDeleteFile}
            className="px-3 py-1 text-sm bg-red-500 text-white hover:bg-red-600 rounded transition-colors"
            title="Delete file"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <MilkdownProvider>
          <MilkdownEditor
            content={initialContent}
            onChange={handleChange}
            onSave={handleSave}
            onNew={handleNewFile}
          />
        </MilkdownProvider>
      </div>
    </div>
  )
}
