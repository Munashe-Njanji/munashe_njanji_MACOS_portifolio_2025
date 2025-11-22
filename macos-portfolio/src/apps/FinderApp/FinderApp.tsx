import React, { useState, useCallback, useEffect, useRef } from 'react'
import type { FinderAppProps } from '@/types/components'
import { useFileStore, useWindowStore } from '@/store'
import { FileTree } from './FileTree'
import { Breadcrumbs } from './Breadcrumbs'
import { Toolbar } from './Toolbar'

export const FinderApp: React.FC<FinderAppProps> = ({ appInstance: _appInstance }) => {
  const { openWindow } = useWindowStore()
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null)
  const pendingRenameRef = useRef<string | null>(null)

  const {
    files,
    createFile,
    deleteFile,
    renameFile,
    moveFile,
    getFileTree,
  } = useFileStore()

  // Get current folder's files
  const currentFiles = getFileTree(currentFolderId ?? undefined)

  // Get breadcrumb path
  const getBreadcrumbPath = useCallback(() => {
    const path: Array<{ id: string | null; name: string }> = [{ id: null, name: 'Home' }]

    if (currentFolderId) {
      let current = files[currentFolderId]
      const tempPath: Array<{ id: string; name: string }> = []
      const visited = new Set<string>() // Prevent infinite loops

      while (current && !visited.has(current.id)) {
        visited.add(current.id)
        tempPath.unshift({ id: current.id, name: current.name })
        if (current.parentId && files[current.parentId]) {
          current = files[current.parentId]
        } else {
          break
        }
      }

      path.push(...tempPath)
    }

    return path
  }, [currentFolderId, files])

  const handleNavigate = useCallback((folderId: string | null) => {
    setCurrentFolderId(folderId)
    setSelectedFileId(null)
  }, [])

  const handleRenameComplete = useCallback(
    (fileId: string, newName: string) => {
      setRenamingFileId(null)
      const file = files[fileId]
      if (file && newName !== file.name) {
        // Validate file name
        if (!newName || newName.trim() === '') {
          console.warn('File name cannot be empty')
          return
        }

        // Check for invalid characters
        const invalidChars = /[<>:"/\\|?*]/g
        if (invalidChars.test(newName)) {
          console.warn('File name contains invalid characters')
          return
        }

        renameFile(fileId, newName.trim())
      }
    },
    [files, renameFile]
  )

  const handleCreateFile = useCallback(
    (type: 'file' | 'folder') => {
      const name = type === 'folder' ? 'New Folder' : 'New File.txt'
      const newFileId = createFile(currentFolderId, name, type)
      
      // Select the newly created file
      setSelectedFileId(newFileId)
      
      // Mark it for renaming
      pendingRenameRef.current = newFileId
    },
    [currentFolderId, createFile]
  )

  // Effect to trigger inline rename when a new file is created
  useEffect(() => {
    if (pendingRenameRef.current && files[pendingRenameRef.current]) {
      const fileId = pendingRenameRef.current
      pendingRenameRef.current = null
      
      // Use setTimeout to ensure the UI has updated
      setTimeout(() => {
        setRenamingFileId(fileId)
      }, 50)
    }
  }, [files])

  const handleDelete = useCallback(
    (fileId: string) => {
      deleteFile(fileId)
      if (selectedFileId === fileId) {
        setSelectedFileId(null)
      }
    },
    [deleteFile, selectedFileId]
  )

  const handleMove = useCallback(
    (fileId: string, newParentId: string) => {
      // Prevent moving a folder into itself or its descendants
      const file = files[fileId]
      if (!file) return

      if (file.type === 'folder') {
        // Check if newParentId is a descendant of fileId
        let current = files[newParentId]
        const visited = new Set<string>()

        while (current && !visited.has(current.id)) {
          if (current.id === fileId) {
            console.warn('Cannot move a folder into itself or its descendants')
            return
          }
          visited.add(current.id)
          if (current.parentId) {
            current = files[current.parentId]
          } else {
            break
          }
        }
      }

      moveFile(fileId, newParentId)
    },
    [files, moveFile]
  )

  const handleFileDoubleClick = useCallback(
    (file: any) => {
      if (file.type === 'folder') {
        handleNavigate(file.id)
      } else {
        // Open file in appropriate app based on mime type
        let appType: string | null = null

        if (file.mimeType?.startsWith('text/')) {
          appType = 'text'
        } else if (file.mimeType === 'application/pdf') {
          appType = 'pdf'
        } else if (file.mimeType?.startsWith('image/')) {
          appType = 'image'
        }

        if (appType) {
          // Open the appropriate app with the file
          openWindow(appType as any, { fileId: file.id })
        } else {
          console.warn('No app available for file type:', file.mimeType)
        }
      }
    },
    [handleNavigate, openWindow]
  )

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Toolbar */}
      <Toolbar onCreateFile={handleCreateFile} onCreateFolder={() => handleCreateFile('folder')} />

      {/* Breadcrumbs */}
      <Breadcrumbs path={getBreadcrumbPath()} onNavigate={handleNavigate} />

      {/* File Tree */}
      <div className="flex-1 overflow-auto p-4">
        <FileTree
          files={currentFiles}
          selectedId={selectedFileId}
          renamingId={renamingFileId}
          onSelect={setSelectedFileId}
          onDoubleClick={handleFileDoubleClick}
          onDelete={handleDelete}
          onRename={handleRenameComplete}
          onMove={handleMove}
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 px-4 flex items-center justify-between border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
        <span>{currentFiles.length} items</span>
        {selectedFileId && files[selectedFileId] && (
          <span>{files[selectedFileId].name}</span>
        )}
      </div>
    </div>
  )
}
