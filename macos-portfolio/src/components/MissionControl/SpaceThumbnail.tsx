import React from 'react'
import type { SpaceThumbnailProps } from '@/types/components'

export const SpaceThumbnail: React.FC<SpaceThumbnailProps> = ({ space, isActive, onClick }) => {
  return (
    <button
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
      className={`
        relative w-32 h-20 rounded-lg overflow-hidden
        transition-all duration-200
        ${
          isActive
            ? 'ring-2 ring-blue-500 shadow-lg scale-105'
            : 'ring-1 ring-white/20 hover:ring-white/40 hover:scale-105'
        }
      `}
    >
      {/* Thumbnail Background */}
      <div
        className={`
        w-full h-full
        bg-gradient-to-br from-blue-400 to-indigo-500
        ${isActive ? 'opacity-100' : 'opacity-70'}
      `}
      >
        {/* Window Count Indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/80 text-xs font-medium">
            {space.windowIds.length} {space.windowIds.length === 1 ? 'window' : 'windows'}
          </div>
        </div>
      </div>

      {/* Space Name */}
      <div
        className={`
        absolute bottom-0 left-0 right-0
        px-2 py-1 text-xs font-medium text-center
        ${isActive ? 'bg-blue-500 text-white' : 'bg-black/30 text-white/90'}
      `}
      >
        {space.name}
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
      )}
    </button>
  )
}
