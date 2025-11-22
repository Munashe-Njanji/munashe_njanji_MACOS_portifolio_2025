import React, { useRef, useCallback, useMemo } from 'react'
import type { DockIconProps } from '@/types/components'
import {
  createDockIconHoverAnimation,
  createDockIconLeaveAnimation,
  createDockIconLaunchAnimation,
} from '@/utils/animations'
import { SettingsIcon } from '@/components/Icon/SettingsIcon'
import { ClipboardIcon } from '@/components/Icon/ClipboardIcon'

interface ExtendedDockIconProps extends DockIconProps {
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  hoveredIndex?: number | null
  currentIndex?: number
  totalIcons?: number
}

export const DockIcon: React.FC<ExtendedDockIconProps> = ({
  app,
  isActive,
  onClick,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
  hoveredIndex,
  currentIndex,
}) => {
  const iconRef = useRef<HTMLDivElement>(null)

  // Calculate magnification scale based on distance from hovered icon
  const scale = useMemo(() => {
    if (hoveredIndex === null || hoveredIndex === undefined || currentIndex === undefined) return 1

    const distance = Math.abs(hoveredIndex - currentIndex)
    if (distance === 0) return 1.6 // Hovered icon
    if (distance === 1) return 1.3 // Adjacent icons
    if (distance === 2) return 1.1 // Two icons away
    return 1 // Default
  }, [hoveredIndex, currentIndex])

  const handleMouseEnter = useCallback(() => {
    if (iconRef.current) {
      createDockIconHoverAnimation(iconRef.current)
    }
    onMouseEnter?.()
  }, [onMouseEnter])

  const handleMouseLeave = useCallback(() => {
    if (iconRef.current) {
      createDockIconLeaveAnimation(iconRef.current)
    }
    onMouseLeave?.()
  }, [onMouseLeave])

  const handleClick = useCallback(() => {
    if (iconRef.current) {
      createDockIconLaunchAnimation(iconRef.current)
    }
    onClick()
  }, [onClick])

  const isImageIcon = app.icon?.startsWith('/') || app.icon?.startsWith('http')
  const isSettingsIcon = app.icon === 'settings'
  const isClipboardIcon = app.icon === 'clipboard'

  return (
    <div className="relative flex flex-col items-center group">
      {/* Active indicator */}
      {isActive && (
        <div
          className="
          absolute -bottom-1 w-1 h-1 
          bg-gray-800 rounded-full
          animate-pulse
        "
        />
      )}

      {/* Icon */}
      <div
        ref={iconRef}
        className="
          w-14 h-14 flex items-center justify-center
          cursor-pointer
          transition-all duration-200 ease-out
          origin-bottom
        "
        style={{
          transform: `scale(${scale}) translateY(${scale > 1 ? -(scale - 1) * 24 : 0}px)`,
        }}
        onClick={handleClick}
        onContextMenu={onContextMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title={app.label}
      >
        {isSettingsIcon ? (
          <div className="w-12 h-12 flex items-center justify-center text-gray-700 drop-shadow-lg">
            <SettingsIcon size={48} />
          </div>
        ) : isClipboardIcon ? (
          <div className="w-12 h-12 flex items-center justify-center text-gray-700 drop-shadow-lg">
            <ClipboardIcon />
          </div>
        ) : isImageIcon ? (
          <img
            src={app.icon}
            alt={app.label}
            className="w-full h-full object-contain pointer-events-none select-none drop-shadow-lg"
            draggable={false}
          />
        ) : (
          <span className="text-3xl">{app.icon || '📱'}</span>
        )}
      </div>

      {/* Tooltip */}
      <div
        className="
        absolute -top-8 px-2 py-1
        bg-gray-800 text-white text-xs rounded
        opacity-0 pointer-events-none
        transition-opacity duration-200
        whitespace-nowrap
        group-hover:opacity-100
      "
      >
        {app.label}
      </div>
    </div>
  )
}
