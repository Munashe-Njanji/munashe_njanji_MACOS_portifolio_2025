import React, { useState, useRef, useEffect } from 'react'
import type { FileItemProps } from '@/types/components'

export const FileItem: React.FC<
  FileItemProps & {
    onDragEnd?: () => void
    onDrop?: () => void
    isDragging?: boolean
    isRenaming?: boolean
    onRenameComplete?: (newName: string) => void
  }
> = ({
  file,
  isSelected,
  onClick,
  onDoubleClick,
  onContextMenu,
  draggable,
  onDragStart,
  onDragEnd,
  onDrop,
  isDragging,
  isRenaming,
  onRenameComplete,
}) => {
  const [editingName, setEditingName] = useState(file.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus()
      // Select the name without extension
      const dotIndex = file.name.lastIndexOf('.')
      if (dotIndex > 0 && file.type === 'file') {
        inputRef.current.setSelectionRange(0, dotIndex)
      } else {
        inputRef.current.select()
      }
    }
  }, [isRenaming, file.name, file.type])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onRenameComplete?.(editingName)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setEditingName(file.name)
      onRenameComplete?.(file.name)
    }
  }

  const handleBlur = () => {
    onRenameComplete?.(editingName)
  }
  const getFileIcon = () => {
    if (file.type === 'folder') return '📁'

    const iconMap: Record<string, string> = {
      'text/plain': '📄',
      'text/markdown': '📝',
      'application/pdf': '📕',
      'image/jpeg': '🖼️',
      'image/png': '🖼️',
      'image/gif': '🖼️',
    }

    return iconMap[file.mimeType || ''] || '📄'
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (file.type === 'folder') {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (file.type === 'folder' && onDrop) {
      onDrop()
    }
  }

  const handleClick = () => {
    if (!isRenaming) {
      onClick()
    }
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event from bubbling to window frame
    if (!isRenaming) {
      onDoubleClick()
    }
  }

  return (
    <div
      className={`
        flex flex-col items-center p-2 rounded-lg
        cursor-pointer transition-all
        ${isSelected ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'}
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={onContextMenu}
      draggable={draggable && !isRenaming}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Icon */}
      <div className="text-5xl mb-2">{getFileIcon()}</div>

      {/* Name */}
      {isRenaming ? (
        <input
          ref={inputRef}
          type="text"
          value={editingName}
          onChange={e => setEditingName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="text-xs text-center w-full px-1 bg-white border border-blue-500 rounded outline-none"
          onClick={e => e.stopPropagation()}
          onDoubleClick={e => e.stopPropagation()}
        />
      ) : (
        <div className="text-xs text-center w-full truncate px-1">{file.name}</div>
      )}

      {/* Drop indicator for folders */}
      {file.type === 'folder' && (
        <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-transparent hover:border-blue-400 transition-colors" />
      )}
    </div>
  )
}
