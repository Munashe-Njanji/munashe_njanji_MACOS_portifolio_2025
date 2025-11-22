import React, { useRef, useState, useCallback, useEffect } from 'react'
import type { ResizableOptions, ResizableInjectedProps, Size } from '@/types'

type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

export function withResizable<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: ResizableOptions = {}
) {
  const {
    minWidth = 400,
    minHeight = 300,
    maxWidth = Infinity,
    maxHeight = Infinity,
    handles = ['se'], // Default to bottom-right corner
    disabled = false,
  } = options

  return function WithResizableComponent(
    props: Omit<P, keyof ResizableInjectedProps> & {
      size?: Size
      onSizeChange?: (size: Size) => void
    }
  ) {
    const elementRef = useRef<HTMLDivElement>(null)
    const [isResizing, setIsResizing] = useState(false)
    const [size, setSize] = useState<Size>(props.size || { w: minWidth, h: minHeight })
    const [activeHandle, setActiveHandle] = useState<ResizeHandle | null>(null)
    const resizeStartPos = useRef<{ x: number; y: number } | null>(null)
    const elementStartSize = useRef<Size | null>(null)

    // Update size when prop changes
    useEffect(() => {
      if (props.size) {
        setSize(props.size)
      }
    }, [props.size])

    const handleResizeStart = useCallback(
      (handle: ResizeHandle) => (e: React.MouseEvent | React.TouchEvent) => {
        if (disabled) return

        e.preventDefault()
        e.stopPropagation()

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

        resizeStartPos.current = { x: clientX, y: clientY }
        elementStartSize.current = { ...size }
        setIsResizing(true)
        setActiveHandle(handle)

        // Add global event listeners
        document.addEventListener('mousemove', handleResizeMove as any)
        document.addEventListener('mouseup', handleResizeEnd as any)
        document.addEventListener('touchmove', handleResizeMove as any)
        document.addEventListener('touchend', handleResizeEnd as any)
      },
      [disabled, size]
    )

    const handleResizeMove = useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (!isResizing || !resizeStartPos.current || !elementStartSize.current || !activeHandle)
          return

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

        const deltaX = clientX - resizeStartPos.current.x
        const deltaY = clientY - resizeStartPos.current.y

        let newWidth = elementStartSize.current.w
        let newHeight = elementStartSize.current.h

        // Calculate new size based on handle
        if (activeHandle.includes('e')) {
          newWidth = elementStartSize.current.w + deltaX
        }
        if (activeHandle.includes('w')) {
          newWidth = elementStartSize.current.w - deltaX
        }
        if (activeHandle.includes('s')) {
          newHeight = elementStartSize.current.h + deltaY
        }
        if (activeHandle.includes('n')) {
          newHeight = elementStartSize.current.h - deltaY
        }

        // Apply constraints
        newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth))
        newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight))

        const newSize = { w: newWidth, h: newHeight }
        setSize(newSize)

        // Notify parent component
        if (props.onSizeChange) {
          props.onSizeChange(newSize)
        }
      },
      [isResizing, activeHandle, minWidth, minHeight, maxWidth, maxHeight, props.onSizeChange]
    )

    const handleResizeEnd = useCallback(() => {
      if (!isResizing) return

      setIsResizing(false)
      setActiveHandle(null)
      resizeStartPos.current = null
      elementStartSize.current = null

      // Remove global event listeners
      document.removeEventListener('mousemove', handleResizeMove as any)
      document.removeEventListener('mouseup', handleResizeEnd as any)
      document.removeEventListener('touchmove', handleResizeMove as any)
      document.removeEventListener('touchend', handleResizeEnd as any)
    }, [isResizing, handleResizeMove])

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        document.removeEventListener('mousemove', handleResizeMove as any)
        document.removeEventListener('mouseup', handleResizeEnd as any)
        document.removeEventListener('touchmove', handleResizeMove as any)
        document.removeEventListener('touchend', handleResizeEnd as any)
      }
    }, [handleResizeMove, handleResizeEnd])

    const getHandleStyle = (handle: ResizeHandle): React.CSSProperties => {
      const baseStyle: React.CSSProperties = {
        position: 'absolute',
        zIndex: 10,
      }

      const size = 8

      switch (handle) {
        case 'n':
          return { ...baseStyle, top: 0, left: 0, right: 0, height: size, cursor: 'ns-resize' }
        case 's':
          return {
            ...baseStyle,
            bottom: 0,
            left: 0,
            right: 0,
            height: size,
            cursor: 'ns-resize',
          }
        case 'e':
          return { ...baseStyle, right: 0, top: 0, bottom: 0, width: size, cursor: 'ew-resize' }
        case 'w':
          return { ...baseStyle, left: 0, top: 0, bottom: 0, width: size, cursor: 'ew-resize' }
        case 'ne':
          return {
            ...baseStyle,
            top: 0,
            right: 0,
            width: size,
            height: size,
            cursor: 'nesw-resize',
          }
        case 'nw':
          return {
            ...baseStyle,
            top: 0,
            left: 0,
            width: size,
            height: size,
            cursor: 'nwse-resize',
          }
        case 'se':
          return {
            ...baseStyle,
            bottom: 0,
            right: 0,
            width: size,
            height: size,
            cursor: 'nwse-resize',
          }
        case 'sw':
          return {
            ...baseStyle,
            bottom: 0,
            left: 0,
            width: size,
            height: size,
            cursor: 'nesw-resize',
          }
        default:
          return baseStyle
      }
    }

    const injectedProps: ResizableInjectedProps = {
      size,
      isResizing,
    }

    return (
      <div
        ref={elementRef}
        style={{
          position: 'relative',
          width: size.w,
          height: size.h,
          userSelect: isResizing ? 'none' : 'auto',
        }}
      >
        <WrappedComponent {...(props as P)} {...injectedProps} />

        {/* Resize handles */}
        {!disabled &&
          handles.map(handle => (
            <div
              key={handle}
              style={getHandleStyle(handle)}
              onMouseDown={handleResizeStart(handle)}
              onTouchStart={handleResizeStart(handle)}
            />
          ))}
      </div>
    )
  }
}
