import React from 'react'
import type { TitleBarProps } from '@/types/components'
import { TrafficLights } from './TrafficLights'

export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  isFocused,
  onClose,
  onMinimize,
  onMaximize,
}) => {
  return (
    <div
      className={`
        h-7 px-3 flex items-center justify-between
        border-b border-gray-200/50
        transition-colors duration-200
        ${isFocused ? 'bg-[#ececec]' : 'bg-[#f6f6f6]'}
      `}
    >
      {/* Traffic lights */}
      <TrafficLights
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        isFocused={isFocused}
      />

      {/* Title */}
      <div
        className={`
        absolute left-1/2 -translate-x-1/2
        text-sm font-medium
        transition-colors duration-200
        ${isFocused ? 'text-gray-800' : 'text-gray-500'}
      `}
      >
        {title}
      </div>

      {/* Right side spacer */}
      <div className="w-[54px]" />
    </div>
  )
}
