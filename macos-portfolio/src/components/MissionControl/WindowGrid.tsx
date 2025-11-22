import React, { useState } from 'react'
import type { WindowGridProps } from '@/types/components'

export const WindowGrid: React.FC<WindowGridProps> = ({ windows, onWindowClick, onWindowDrag }) => {
  const [draggedWindowId, setDraggedWindowId] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, windowId: string) => {
    setDraggedWindowId(windowId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('windowId', windowId)
  }

  const handleDragEnd = () => {
    setDraggedWindowId(null)
  }

  const handleDrop = (e: React.DragEvent, targetSpaceId: string) => {
    e.preventDefault()
    const windowId = e.dataTransfer.getData('windowId')
    if (windowId && windowId !== draggedWindowId) {
      return
    }
    if (windowId) {
      onWindowDrag(windowId, targetSpaceId)
    }
    setDraggedWindowId(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const getWindowTitle = (window: any) => {
    const titleMap: Record<string, string> = {
      finder: 'Finder',
      safari: 'Safari',
      pdf: 'PDF Viewer',
      text: 'Text Editor',
      image: 'Image Viewer',
      terminal: 'Terminal',
      preferences: 'System Preferences',
      clipboard: 'Clipboard Manager',
    }
    return titleMap[window.appType] || window.appType
  }

  const getWindowIcon = (window: any) => {
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
    return iconMap[window.appType] || '📱'
  }

  if (windows.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-white/50">
          <div className="text-6xl mb-4">🪟</div>
          <p className="text-lg">No open windows</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="
        w-full h-full
        grid gap-6
        grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        auto-rows-min
        overflow-y-auto
        p-4
      "
      onDrop={e => handleDrop(e, windows[0]?.spaceId || 'default')}
      onDragOver={handleDragOver}
    >
      {windows.map(window => (
        <div
          key={window.id}
          draggable
          onDragStart={e => handleDragStart(e, window.id)}
          onDragEnd={handleDragEnd}
          onClick={e => {
            e.stopPropagation()
            onWindowClick(window.id)
          }}
          className={`
            relative aspect-video
            bg-white rounded-lg shadow-lg
            cursor-pointer
            transition-all duration-200
            hover:scale-105 hover:shadow-xl
            ${draggedWindowId === window.id ? 'opacity-50 scale-95' : ''}
          `}
        >
          {/* Window Preview */}
          <div className="w-full h-full flex flex-col">
            {/* Title Bar */}
            <div className="h-6 bg-gray-100 rounded-t-lg flex items-center px-2 border-b border-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 text-center text-xs text-gray-600 font-medium truncate px-2">
                {getWindowTitle(window)}
              </div>
            </div>

            {/* Content Preview */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-b-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">{getWindowIcon(window)}</div>
                <div className="text-sm text-gray-600">{getWindowTitle(window)}</div>
              </div>
            </div>
          </div>

          {/* Drag Indicator */}
          {draggedWindowId === window.id && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 rounded-lg">
              <div className="text-white text-sm font-medium">Dragging...</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
