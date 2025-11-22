import React, { useState, useCallback } from 'react'
import type { FileNode } from '@/types'
import { FileItem } from './FileItem'
import { useUIStore } from '@/store'

interface FileTreeProps {
  files: FileNode[]
  selectedId: string | null
  renamingId: string | null
  onSelect: (id: string) => void
  onDoubleClick: (file: FileNode) => void
  onDelete: (id: string) => void
  onRename: (id: string, newName: string) => void
  onMove: (fileId: string, newParentId: string) => void
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  selectedId,
  renamingId,
  onSelect,
  onDoubleClick,
  onDelete,
  onRename,
  onMove,
}) => {
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null)
  const { showContextMenu, hideContextMenu } = useUIStore()

  const handleRenameComplete = useCallback(
    (fileId: string, newName: string) => {
      const file = files.find(f => f.id === fileId)
      if (file && newName !== file.name) {
        onRename(fileId, newName)
      }
    },
    [files, onRename]
  )

  const handleDragStart = (file: FileNode) => {
    setDraggedFileId(file.id)
  }

  const handleDragEnd = () => {
    setDraggedFileId(null)
  }

  const handleDrop = (targetId: string) => {
    if (draggedFileId && draggedFileId !== targetId) {
      onMove(draggedFileId, targetId)
    }
    setDraggedFileId(null)
  }

  const handleContextMenu = useCallback(
    (file: FileNode, e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation() // Prevent event from bubbling to desktop

      const menuItems = [
        {
          id: 'open',
          label: 'Open',
          icon: '📂',
          action: () => {
            onDoubleClick(file)
            hideContextMenu()
          },
        },
        {
          id: 'separator-1',
          label: '',
          separator: true,
          action: () => {},
        },
        {
          id: 'rename',
          label: 'Rename',
          icon: '✏️',
          action: () => {
            const newName = prompt('Enter new name:', file.name)
            if (newName && newName !== file.name) {
              onRename(file.id, newName)
            }
            hideContextMenu()
          },
        },
        {
          id: 'delete',
          label: 'Delete',
          icon: '🗑️',
          action: () => {
            if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
              onDelete(file.id)
            }
            hideContextMenu()
          },
        },
        {
          id: 'separator-2',
          label: '',
          separator: true,
          action: () => {},
        },
        {
          id: 'info',
          label: 'Get Info',
          icon: 'ℹ️',
          action: () => {
            alert(`Name: ${file.name}\nType: ${file.type}\nCreated: ${new Date(file.createdAt).toLocaleString()}`)
            hideContextMenu()
          },
        },
      ]

      showContextMenu(e.clientX, e.clientY, menuItems)
    },
    [onDoubleClick, onRename, onDelete, showContextMenu, hideContextMenu]
  )

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <div className="text-6xl mb-4">📁</div>
        <p className="text-lg">This folder is empty</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {files.map(file => (
        <FileItem
          key={file.id}
          file={file}
          isSelected={file.id === selectedId}
          isRenaming={file.id === renamingId}
          onClick={() => onSelect(file.id)}
          onDoubleClick={() => onDoubleClick(file)}
          onContextMenu={e => handleContextMenu(file, e)}
          onRenameComplete={newName => handleRenameComplete(file.id, newName)}
          draggable
          onDragStart={() => handleDragStart(file)}
          onDragEnd={handleDragEnd}
          onDrop={() => handleDrop(file.id)}
          isDragging={draggedFileId === file.id}
        />
      ))}
    </div>
  )
}
