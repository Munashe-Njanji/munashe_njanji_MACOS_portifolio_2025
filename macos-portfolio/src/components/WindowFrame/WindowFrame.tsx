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
  const previousSizeRef = useRef<{ position: { x: number; y: number }; size: { w: number; h: number } } | null>(null)
  const { updateWindowPosition, focusWindow, maximizeWindow } = useWindowStore()

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation() // Prevent event from bubbling to Desktop
      
      // If maximized, restore to previous size
      if (appInstance.state.maximized && previousSizeRef.current && windowId) {
        // Restore previous size
        const { position, size } = previousSizeRef.current
        updateWindowPosition(windowId, position)
        useWindowStore.getState().updateWindowSize(windowId, size)
        maximizeWindow(windowId) // Toggle off maximized state
        previousSizeRef.current = null
      } else {
        // Save current size before maximizing
        if (windowId && !appInstance.state.maximized) {
          previousSizeRef.current = {
            position: { ...appInstance.position },
            size: { ...appInstance.size }
          }
        }
        onMaximize()
      }
    },
    [onMaximize, appInstance.state.maximized, appInstance.position, appInstance.size, windowId, updateWindowPosition, maximizeWindow]
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

      // If window is maximized and user starts dragging, restore it first
      if (appInstance.state.maximized && previousSizeRef.current && windowId) {
        const { size } = previousSizeRef.current
        
        // Calculate new position so window follows cursor
        const mouseXPercent = e.clientX / window.innerWidth
        const newX = e.clientX - (size.w * mouseXPercent)
        const newY = e.clientY - 14 // Offset for title bar height
        
        // Restore size
        useWindowStore.getState().updateWindowSize(windowId, size)
        maximizeWindow(windowId) // Toggle off maximized state
        
        // Set new position under cursor
        dragStartRef.current = { x: e.clientX, y: e.clientY }
        positionStartRef.current = { x: newX, y: Math.max(24, newY) }
        updateWindowPosition(windowId, { x: newX, y: Math.max(24, newY) })
        previousSizeRef.current = null
        setIsDragging(true)
      } else {
        dragStartRef.current = { x: e.clientX, y: e.clientY }
        positionStartRef.current = { x: appInstance.position.x, y: appInstance.position.y }
        setIsDragging(true)
      }

      // Focus window
      handleClick()
    },
    [appInstance.position, appInstance.state.maximized, handleClick, windowId, maximizeWindow, updateWindowPosition]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current || !positionStartRef.current || !windowId) return

      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y

      const newX = positionStartRef.current.x + deltaX
      const newY = Math.max(24, positionStartRef.current.y + deltaY) // Keep below menu bar (24px height)

      updateWindowPosition(windowId, { x: newX, y: newY })
    },
    [isDragging, windowId, updateWindowPosition]
  )

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isDragging || !windowId) {
      setIsDragging(false)
      dragStartRef.current = null
      positionStartRef.current = null
      return
    }

    // Check if window was dragged to the top (menu bar area)
    if (e.clientY <= 24 && !appInstance.state.maximized) {
      // Save current size before maximizing
      previousSizeRef.current = {
        position: { ...appInstance.position },
        size: { ...appInstance.size }
      }
      // Maximize the window
      maximizeWindow(windowId)
    }

    setIsDragging(false)
    dragStartRef.current = null
    positionStartRef.current = null
  }, [isDragging, windowId, appInstance.state.maximized, appInstance.position, appInstance.size, maximizeWindow])

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
        left: appInstance.state.maximized ? 0 : appInstance.position.x,
        top: appInstance.state.maximized ? 24 : Math.max(24, appInstance.position.y), // Always keep below menu bar
        width: appInstance.state.maximized ? '100%' : appInstance.size.w,
        height: appInstance.state.maximized ? 'calc(100vh - 24px)' : appInstance.size.h, // Full height minus menu bar only
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
