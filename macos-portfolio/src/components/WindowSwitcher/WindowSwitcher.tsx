import React from 'react'
import type { AppInstance } from '@/types'

interface WindowSwitcherProps {
  isVisible: boolean
  windows: AppInstance[]
  selectedIndex: number
}

export const WindowSwitcher: React.FC<WindowSwitcherProps> = ({
  isVisible,
  windows,
  selectedIndex,
}) => {
  if (!isVisible || windows.length === 0) return null

  const getAppIcon = (appType: string) => {
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
    return iconMap[appType] || '📱'
  }

  const getAppTitle = (appType: string) => {
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
    return titleMap[appType] || appType
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-gray-200/50">
        <div className="flex items-center space-x-4">
          {windows.map((window, index) => (
            <div
              key={window.id}
              className={`
                flex flex-col items-center p-4 rounded-xl transition-all
                ${
                  index === selectedIndex
                    ? 'bg-blue-500 text-white scale-110 shadow-lg'
                    : 'bg-gray-100 text-gray-700'
                }
              `}
              style={{ minWidth: '120px' }}
            >
              <div className="text-5xl mb-2">{getAppIcon(window.appType)}</div>
              <div className="text-sm font-medium text-center truncate w-full">
                {getAppTitle(window.appType)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-xs text-gray-600">
          Press Tab to cycle • Release Alt to switch
        </div>
      </div>
    </div>
  )
}
