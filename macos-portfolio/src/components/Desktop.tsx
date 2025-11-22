import React, { useCallback } from 'react'
import type { DesktopProps } from '@/types/components'
import { useWindowStore, useUIStore } from '@/store'

export const Desktop: React.FC<DesktopProps> = ({ wallpaper, children }) => {
  const openWindow = useWindowStore(state => state.openWindow)
  const { showContextMenu, hideContextMenu } = useUIStore()

  const handleDoubleClick = useCallback(() => {
    openWindow('finder')
  }, [openWindow])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      showContextMenu(e.clientX, e.clientY, [
        {
          id: 'new-folder',
          label: 'New Folder',
          icon: '📁',
          action: () => {
            openWindow('finder')
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
          id: 'change-wallpaper',
          label: 'Change Wallpaper',
          icon: '🖼️',
          action: () => {
            openWindow('preferences')
            hideContextMenu()
          },
        },
      ])
    },
    [showContextMenu, hideContextMenu, openWindow]
  )

  const getWallpaperStyle = (): React.CSSProperties => {
    // Check if wallpaper is an image path
    if (wallpaper.startsWith('/') || wallpaper.startsWith('http')) {
      return {
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    }

    // Predefined gradient wallpapers
    const wallpapers: Record<string, string> = {
      'gradient-blue': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'gradient-sunset': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'gradient-ocean': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'gradient-forest': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'gradient-purple': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    }

    return {
      background: wallpapers[wallpaper] || wallpapers['gradient-blue'],
    }
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={getWallpaperStyle()}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      {children}
    </div>
  )
}
