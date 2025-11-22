import React, { useRef, useState, useCallback, useEffect } from 'react'
import type { DraggableOptions, DraggableInjectedProps, Position } from '@/types'
import { createWindowDragLiftAnimation, createWindowDragDropAnimation } from '@/utils/animations'

export function withDraggable<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: DraggableOptions = {}
) {
  return function WithDraggableComponent(
    props: Omit<P, keyof DraggableInjectedProps> & {
      position?: Position
      onPositionChange?: (position: Position) => void
    }
  ) {
    const elementRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [position, setPosition] = useState<Position>(props.position || { x: 0, y: 0 })
    const dragStartPos = useRef<{ x: number; y: number } | null>(null)
    const elementStartPos = useRef<Position | null>(null)

    // Update position when prop changes
    useEffect(() => {
      if (props.position) {
        setPosition(props.position)
      }
    }, [props.position])

    const handleDragStart = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        if (options.disabled) return

        // Check if drag should be initiated from handle
        if (options.handle) {
          const target = e.target as HTMLElement
          const handle = elementRef.current?.querySelector(options.handle)
          if (!handle || !handle.contains(target)) {
            return
          }
        }

        e.preventDefault()
        e.stopPropagation()

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

        dragStartPos.current = { x: clientX, y: clientY }
        elementStartPos.current = { ...position }
        setIsDragging(true)

        // Apply lift animation
        if (elementRef.current) {
          createWindowDragLiftAnimation(elementRef.current)
        }

        // Add global event listeners
        document.addEventListener('mousemove', handleDragMove as any)
        document.addEventListener('mouseup', handleDragEnd as any)
        document.addEventListener('touchmove', handleDragMove as any)
        document.addEventListener('touchend', handleDragEnd as any)
      },
      [options.disabled, options.handle, position]
    )

    const handleDragMove = useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (!isDragging || !dragStartPos.current || !elementStartPos.current) return

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

        let newX = elementStartPos.current.x + (clientX - dragStartPos.current.x)
        let newY = elementStartPos.current.y + (clientY - dragStartPos.current.y)

        // Apply grid snapping
        if (options.grid) {
          newX = Math.round(newX / options.grid[0]) * options.grid[0]
          newY = Math.round(newY / options.grid[1]) * options.grid[1]
        }

        // Apply bounds
        if (options.bounds) {
          if (options.bounds === 'parent' && elementRef.current?.parentElement) {
            const parent = elementRef.current.parentElement
            const parentRect = parent.getBoundingClientRect()
            const elementRect = elementRef.current.getBoundingClientRect()

            newX = Math.max(0, Math.min(newX, parentRect.width - elementRect.width))
            newY = Math.max(0, Math.min(newY, parentRect.height - elementRect.height))
          } else if (typeof options.bounds === 'object') {
            newX = Math.max(options.bounds.left, Math.min(newX, options.bounds.right))
            newY = Math.max(options.bounds.top, Math.min(newY, options.bounds.bottom))
          }
        }

        const newPosition = { x: newX, y: newY }
        setPosition(newPosition)

        // Notify parent component
        if (props.onPositionChange) {
          props.onPositionChange(newPosition)
        }
      },
      [isDragging, options.grid, options.bounds, props.onPositionChange]
    )

    const handleDragEnd = useCallback(() => {
      if (!isDragging) return

      setIsDragging(false)
      dragStartPos.current = null
      elementStartPos.current = null

      // Apply drop animation
      if (elementRef.current) {
        createWindowDragDropAnimation(elementRef.current)
      }

      // Remove global event listeners
      document.removeEventListener('mousemove', handleDragMove as any)
      document.removeEventListener('mouseup', handleDragEnd as any)
      document.removeEventListener('touchmove', handleDragMove as any)
      document.removeEventListener('touchend', handleDragEnd as any)
    }, [isDragging, handleDragMove])

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        document.removeEventListener('mousemove', handleDragMove as any)
        document.removeEventListener('mouseup', handleDragEnd as any)
        document.removeEventListener('touchmove', handleDragMove as any)
        document.removeEventListener('touchend', handleDragEnd as any)
      }
    }, [handleDragMove, handleDragEnd])

    const injectedProps: DraggableInjectedProps = {
      onDragStart: handleDragStart,
      position,
      isDragging,
    }

    return (
      <div
        ref={elementRef}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          cursor: isDragging ? 'grabbing' : options.handle ? 'default' : 'grab',
          userSelect: isDragging ? 'none' : 'auto',
        }}
        onMouseDown={!options.handle ? handleDragStart : undefined}
        onTouchStart={!options.handle ? handleDragStart : undefined}
      >
        <WrappedComponent {...(props as P)} {...injectedProps} />
      </div>
    )
  }
}
