import React from 'react'
import type { WindowManagerProps } from '@/types/components'
import { WindowFrame } from '../WindowFrame'
import { FinderApp } from '@/apps/FinderApp'
import { PdfViewerApp } from '@/apps/PdfViewerApp'
import { SafariApp } from '@/apps/SafariApp'
import { TextEditorApp } from '@/apps/TextEditorApp'
import { PreferencesApp } from '@/apps/PreferencesApp'
import { TerminalApp } from '@/apps/TerminalApp/TerminalApp'
import { ImageViewerApp } from '@/apps/ImageViewerApp'
import { useWindowStore } from '@/store'

export const WindowManager: React.FC<WindowManagerProps> = ({ windows, activeSpaceId }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useWindowStore()

  // Filter windows by active space
  const visibleWindows = windows.filter(
    window => window.spaceId === activeSpaceId && !window.state.minimized
  )

  // Sort by z-index to ensure proper rendering order
  const sortedWindows = [...visibleWindows].sort((a, b) => a.zIndex - b.zIndex)

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sortedWindows.map(window => (
        <div key={window.id} className="pointer-events-auto">
          <WindowFrame
            appInstance={window}
            windowId={window.id}
            title={getWindowTitle(window)}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onMaximize={() => maximizeWindow(window.id)}
            onFocus={() => focusWindow(window.id)}
          >
            {renderWindowContent(window)}
          </WindowFrame>
        </div>
      ))}
    </div>
  )
}

// Helper function to get window title
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

// Helper function to render window content
const renderWindowContent = (window: any) => {
  switch (window.appType) {
    case 'finder':
      return <FinderApp appInstance={window} />

    case 'pdf':
      return <PdfViewerApp appInstance={window} fileId={window.props?.fileId} fileContent={''} onUpdate={() => {}} />

    case 'safari':
      return <SafariApp appInstance={window} onUpdate={() => {}} />

    case 'text':
      return <TextEditorApp appInstance={window} fileId={window.props?.fileId} fileContent={''} onUpdate={() => {}} />

    case 'preferences':
      return <PreferencesApp appInstance={window} />

    case 'terminal':
      return <TerminalApp appInstance={window} />

    case 'image':
      return <ImageViewerApp appInstance={window} />

    default:
      // Placeholder for other apps
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-4xl mb-4">{getAppIcon(window.appType)}</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{getWindowTitle(window)}</h2>
            <p className="text-gray-600">App content will be implemented in the next tasks</p>
          </div>
        </div>
      )
  }
}

// Helper function to get app icon
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
