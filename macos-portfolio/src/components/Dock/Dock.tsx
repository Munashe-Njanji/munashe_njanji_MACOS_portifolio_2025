import React, { useCallback, useState } from 'react'
import type { DockProps } from '@/types/components'
import { useUIStore, useWindowStore } from '@/store'
import { DockIcon } from './DockIcon'

export const Dock: React.FC<DockProps> = ({
  apps,
  activeAppIds,
  onLaunch,
  onFocus,
  position = 'bottom',
}) => {
  const { showContextMenu, hideContextMenu } = useUIStore()
  const windows = useWindowStore(state => state.windows)
  const restoreWindow = useWindowStore(state => state.restoreWindow)
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Check if any visible (non-minimized) window is maximized
  const hasMaximizedWindow = windows.some(w => w.state.maximized && !w.state.minimized)

  const handleIconClick = useCallback(
    (app: any) => {
      const isActive = activeAppIds.includes(app.appType)
      
      if (isActive) {
        // Find windows of this app type
        const appWindows = windows.filter(w => w.appType === app.appType)
        
        if (appWindows.length > 0) {
          // Check if any window is minimized
          const minimizedWindow = appWindows.find(w => w.state.minimized)
          
          if (minimizedWindow) {
            // Restore the minimized window (this also focuses it)
            restoreWindow(minimizedWindow.id)
          } else {
            // Just focus the app (cycles through windows if multiple)
            onFocus(app.appType)
          }
        }
      } else {
        // App not open, launch it
        onLaunch(app.appType)
      }
    },
    [activeAppIds, onFocus, onLaunch, windows, restoreWindow]
  )

  const handleIconContextMenu = useCallback(
    (e: React.MouseEvent, app: any) => {
      e.preventDefault()
      const isActive = activeAppIds.includes(app.appType)

      const menuItems = [
        {
          id: 'new-window',
          label: 'New Window',
          icon: '🪟',
          action: () => {
            onLaunch(app.appType)
            hideContextMenu()
          },
        },
        ...(isActive
          ? [
              {
                id: 'separator-1',
                label: '',
                separator: true,
                action: () => {},
              },
              {
                id: 'quit',
                label: 'Quit',
                icon: '❌',
                action: () => {
                  // TODO: Implement quit functionality
                  hideContextMenu()
                },
              },
            ]
          : []),
        {
          id: 'separator-2',
          label: '',
          separator: true,
          action: () => {},
        },
        {
          id: 'keep-in-dock',
          label: app.keepInDock ? 'Remove from Dock' : 'Keep in Dock',
          icon: app.keepInDock ? '➖' : '📌',
          action: () => {
            // TODO: Implement keep in dock functionality
            hideContextMenu()
          },
        },
      ]

      showContextMenu(e.clientX, e.clientY, menuItems)
    },
    [activeAppIds, onLaunch, showContextMenu, hideContextMenu]
  )

  const getDockClasses = () => {
    const baseClasses = `
      theme-dock
      fixed flex items-end justify-center
      rounded-2xl
      border border-white/20
      shadow-lg
      transition-[transform,opacity,background-color] duration-300 ease-out
      overflow-visible
      origin-bottom
    `

    // Auto-hide when maximized
    const hideTransform = hasMaximizedWindow && !isHovered

    switch (position) {
      case 'left':
        return `${baseClasses} left-1 md:left-2 top-1/2 -translate-y-1/2 flex-col h-auto w-12 md:w-16 py-2 md:py-4 ${
          hideTransform ? '-translate-x-20 opacity-0' : ''
        }`
      case 'right':
        return `${baseClasses} right-1 md:right-2 top-1/2 -translate-y-1/2 flex-col h-auto w-12 md:w-16 py-2 md:py-4 ${
          hideTransform ? 'translate-x-20 opacity-0' : ''
        }`
      case 'bottom':
      default:
        return `${baseClasses} bottom-1 md:bottom-2 left-1/2 -translate-x-1/2 w-auto h-12 md:h-16 px-2 md:px-3 pb-1 md:pb-2 ${
          hideTransform ? 'translate-y-20 opacity-0' : ''
        }`
    }
  }

  // Calculate dock scale based on hover state
  const getDockScale = () => {
    return hoveredIndex !== null ? 1.15 : 1
  }

  const getIconContainerClasses = () => {
    switch (position) {
      case 'left':
      case 'right':
        return 'flex flex-col space-y-1 md:space-y-2'
      case 'bottom':
      default:
        return 'flex space-x-1 md:space-x-1.5'
    }
  }

  return (
    <>
      {/* Hover trigger area when dock is hidden */}
      {hasMaximizedWindow && (
        <div
          className={`fixed ${
            position === 'bottom'
              ? 'bottom-0 left-0 right-0 h-4'
              : position === 'left'
                ? 'left-0 top-0 bottom-0 w-4'
                : 'right-0 top-0 bottom-0 w-4'
          } z-[9998]`}
          onMouseEnter={() => setIsHovered(true)}
        />
      )}

      <div
        className={getDockClasses()}
        style={{
          zIndex: 9999,
          transform: `scale(${getDockScale()})`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setHoveredIndex(null)
        }}
      >
        <div className={getIconContainerClasses()}>
          {apps.map((app, index) => (
            <DockIcon
              key={app.id}
              app={app}
              isActive={activeAppIds.includes(app.appType)}
              onClick={() => handleIconClick(app)}
              onContextMenu={e => handleIconContextMenu(e, app)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              hoveredIndex={hoveredIndex}
              currentIndex={index}
            />
          ))}
        </div>
      </div>
    </>
  )
}
