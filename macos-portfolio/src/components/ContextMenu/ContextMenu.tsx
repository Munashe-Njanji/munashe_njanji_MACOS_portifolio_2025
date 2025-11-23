import React, { useRef, useEffect, useCallback, useLayoutEffect, useState } from 'react'
import type { ContextMenuProps } from '@/types/components'
import { createContextMenuAnimation } from '@/utils/animations'

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = useState({ x, y })

  useEffect(() => {
    if (menuRef.current) {
      createContextMenuAnimation(menuRef.current)
    }
  }, [])

  // Adjust position after render to keep menu within viewport
  useLayoutEffect(() => {
    if (!menuRef.current) return

    const rect = menuRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let adjustedX = x
    let adjustedY = y

    // Adjust horizontal position
    if (x + rect.width > viewportWidth) {
      adjustedX = viewportWidth - rect.width - 10
    }

    // Adjust vertical position
    if (y + rect.height > viewportHeight) {
      adjustedY = viewportHeight - rect.height - 10
    }

    setAdjustedPosition({ x: Math.max(10, adjustedX), y: Math.max(10, adjustedY) })
  }, [x, y])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleItemClick = useCallback((item: any) => {
    if (!item.disabled && !item.separator) {
      item.action()
    }
  }, [])

  return (
    <div
      ref={menuRef}
      className="
        fixed z-[9999] min-w-[180px]
        bg-white/95 backdrop-blur-md
        border border-gray-200/50
        rounded-lg shadow-lg
        py-1
      "
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      {items.map((item, index) => {
        if (item.separator) {
          return <div key={`separator-${index}`} className="h-px bg-gray-200 mx-2 my-1" />
        }

        return (
          <button
            key={item.id}
            className={`
              w-full px-3 py-2 text-left text-sm
              flex items-center space-x-3
              transition-colors duration-150
              ${
                item.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-800 hover:bg-blue-50 hover:text-blue-800'
              }
            `}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
          >
            {item.icon && <span className="text-base">{item.icon}</span>}
            <span className="flex-1">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
