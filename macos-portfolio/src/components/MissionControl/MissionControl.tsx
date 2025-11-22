import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import type { MissionControlProps } from '@/types/components'
import { SpaceThumbnail } from './SpaceThumbnail'
import { WindowGrid } from './WindowGrid'

export const MissionControl: React.FC<MissionControlProps> = ({
  isActive,
  onClose,
  windows,
  spaces,
  activeSpaceId,
  onCreateSpace,
  onSwitchSpace,
  onMoveWindow,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current && isActive) {
      // Simple fade and scale animation
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
      )
    }
  }, [isActive])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        onClose()
      }
    }

    const handleF3 = (e: KeyboardEvent) => {
      if (e.key === 'F3') {
        e.preventDefault()
        if (isActive) {
          onClose()
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleF3)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleF3)
    }
  }, [isActive, onClose])

  if (!isActive) return null

  return (
    <div
      ref={containerRef}
      className="
        fixed inset-0 z-[9997]
        bg-gradient-to-br from-gray-900 to-gray-800
        overflow-hidden
      "
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-8 left-0 right-0 flex justify-center">
        <h1 className="text-3xl font-semibold text-white/90">Mission Control</h1>
      </div>

      {/* Spaces Bar */}
      <div className="absolute top-24 left-0 right-0 flex justify-center px-8">
        <div className="flex items-center space-x-4">
          {Object.values(spaces).map(space => (
            <SpaceThumbnail
              key={space.id}
              space={space}
              isActive={space.id === activeSpaceId}
              onClick={() => {
                onSwitchSpace(space.id)
                onClose()
              }}
            />
          ))}

          {/* Add Desktop Button */}
          <button
            onClick={e => {
              e.stopPropagation()
              onCreateSpace()
            }}
            className="
              w-32 h-20 rounded-lg
              border-2 border-dashed border-white/30
              hover:border-white/50 hover:bg-white/10
              transition-all duration-200
              flex items-center justify-center
              text-white/70 hover:text-white/90
            "
          >
            <div className="text-center">
              <div className="text-3xl mb-1">+</div>
              <div className="text-xs">Add Desktop</div>
            </div>
          </button>
        </div>
      </div>

      {/* Windows Grid */}
      <div className="absolute top-52 left-0 right-0 bottom-0 px-8 pb-8">
        <WindowGrid windows={windows} onWindowClick={onClose} onWindowDrag={onMoveWindow} />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="text-white/60 text-sm space-x-6">
          <span>Press ESC or F3 to exit</span>
          <span>•</span>
          <span>Click a window to focus</span>
          <span>•</span>
          <span>Drag windows between desktops</span>
        </div>
      </div>
    </div>
  )
}
