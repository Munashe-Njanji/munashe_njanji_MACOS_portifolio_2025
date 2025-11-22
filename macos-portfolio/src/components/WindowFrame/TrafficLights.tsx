import React from 'react'
import type { TrafficLightsProps } from '@/types/components'

export const TrafficLights: React.FC<TrafficLightsProps> = ({
  onClose,
  onMinimize,
  onMaximize,
  isFocused,
}) => {
  const buttonClass = `
    w-3 h-3 rounded-full transition-all duration-150
    hover:brightness-90 active:scale-95
    flex items-center justify-center
    text-[8px] font-bold
  `

  return (
    <div className="flex items-center space-x-2">
      {/* Close button */}
      <button
        className={`${buttonClass} ${
          isFocused ? 'bg-[#ff5f57] hover:bg-[#ff4136]' : 'bg-gray-300'
        }`}
        onClick={onClose}
        title="Close"
      >
        {isFocused && (
          <span className="text-[#8b0000] opacity-0 hover:opacity-100 transition-opacity">×</span>
        )}
      </button>

      {/* Minimize button */}
      <button
        className={`${buttonClass} ${
          isFocused ? 'bg-[#ffbd2e] hover:bg-[#ffaa00]' : 'bg-gray-300'
        }`}
        onClick={onMinimize}
        title="Minimize"
      >
        {isFocused && (
          <span className="text-[#8b4500] opacity-0 hover:opacity-100 transition-opacity">−</span>
        )}
      </button>

      {/* Maximize button */}
      <button
        className={`${buttonClass} ${
          isFocused ? 'bg-[#28ca42] hover:bg-[#00d924]' : 'bg-gray-300'
        }`}
        onClick={onMaximize}
        title="Maximize"
      >
        {isFocused && (
          <span className="text-[#004d00] opacity-0 hover:opacity-100 transition-opacity">+</span>
        )}
      </button>
    </div>
  )
}
