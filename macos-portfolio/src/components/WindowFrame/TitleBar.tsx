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
        theme-window-chrome
        h-7 px-3 flex items-center justify-between
        transition-colors duration-300
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
        theme-text-primary
        absolute left-1/2 -translate-x-1/2
        text-sm font-medium
        transition-colors duration-300
      `}
      >
        {title}
      </div>

      {/* Right side spacer */}
      <div className="w-[54px]" />
    </div>
  )
}
