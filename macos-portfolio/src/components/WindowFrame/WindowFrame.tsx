import React, { useRef, useCallback, useState } from 'react'
import { useWindowStore } from '@/store'
import type { WindowFrameProps } from '@/types/components'
import { TitleBar } from './TitleBar'

export const WindowFrame: React.FC<WindowFrameProps & { windowId?: string }> = ({
  appInstance,
  windowId,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  children,
  title,
}) => {
  const windowRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const positionStartRef = useRef<{ x: number; y: number } | null>(null)
  const { updateWindowPosition, focusWindow } = useWindowStore()

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation() // Prevent event from bubbling to Desktop
      onMaximize()
    },
    [onMaximize]
  )

  const handleClick = useCallback(() => {
    onFocus()
    if (windowId) {
      focusWindow(windowId)
    }
  }, [onFocus, windowId, focusWindow])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only drag from title bar
      const target = e.target as HTMLElement
      const titleBar = windowRef.current?.querySelector('.title-bar')
      if (!titleBar || !titleBar.contains(target)) {
        return
      }

      // Don't drag if clicking on buttons
      if (target.closest('button')) {
        return
      }

      e.preventDefault()
      e.stopPropagation()

      dragStartRef.current = { x: e.clientX, y: e.clientY }
      positionStartRef.current = { x: appInstance.position.x, y: appInstance.position.y }
      setIsDragging(true)

      // Focus window
      handleClick()
    },
    [appInstance.position, handleClick]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current || !positionStartRef.current || !windowId) return

      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y

      const newX = positionStartRef.current.x + deltaX
      const newY = Math.max(0, positionStartRef.current.y + deltaY) // Keep below menu bar

      updateWindowPosition(windowId, { x: newX, y: newY })
    },
    [isDragging, windowId, updateWindowPosition]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    dragStartRef.current = null
    positionStartRef.current = null
  }, [])

  // Add/remove global listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Check if mobile
  const isMobile = window.innerWidth < 768

  return (
    <div
      ref={windowRef}
      className={`
        theme-window
        absolute rounded-[10px] md:rounded-[10px] overflow-hidden flex flex-col
        ${isDragging ? 'cursor-grabbing dragging' : 'transition-colors duration-300'}
        ${
          appInstance.state.focused
            ? 'shadow-[0_20px_60px_var(--theme-shadowHeavy),0_4px_12px_var(--theme-shadowMedium)]'
            : 'shadow-[0_10px_40px_var(--theme-shadowMedium),0_2px_8px_var(--theme-shadowLight)]'
        }
        ${appInstance.state.minimized ? 'opacity-0 pointer-events-none' : ''}
        ${isMobile && appInstance.state.maximized ? '!left-0 !top-8 !w-full !h-[calc(100vh-8rem)]' : ''}
      `}
      style={{
        left: isMobile && appInstance.state.maximized ? 0 : appInstance.position.x,
        top: isMobile && appInstance.state.maximized ? 32 : appInstance.position.y,
        width: isMobile && appInstance.state.maximized ? '100%' : appInstance.size.w,
        height: isMobile && appInstance.state.maximized ? 'calc(100vh - 8rem)' : appInstance.size.h,
        zIndex: appInstance.zIndex,
        userSelect: isDragging ? 'none' : 'auto',
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onDoubleClick={e => e.stopPropagation()}
    >
      {/* Title bar */}
      <div className="title-bar cursor-move" onDoubleClick={handleDoubleClick}>
        <TitleBar
          title={title || appInstance.appType}
          isFocused={appInstance.state.focused || false}
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
        />
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
