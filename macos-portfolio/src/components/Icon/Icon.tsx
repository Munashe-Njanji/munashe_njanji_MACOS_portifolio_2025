import React from 'react'
import type { IconProps } from '@/types/components'

export const Icon: React.FC<IconProps> = ({
  src,
  alt,
  size = 'md',
  label,
  onClick,
  onDoubleClick,
  onContextMenu,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-lg'
      case 'lg':
        return 'w-16 h-16 text-3xl'
      case 'xl':
        return 'w-20 h-20 text-4xl'
      case 'md':
      default:
        return 'w-12 h-12 text-2xl'
    }
  }

  const isEmoji =
    /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
      src
    )

  return (
    <div className="flex flex-col items-center group">
      {/* Icon */}
      <div
        className={`
          ${getSizeClasses()}
          flex items-center justify-center
          rounded-lg
          transition-all duration-200
          ${onClick || onDoubleClick ? 'cursor-pointer hover:scale-105' : ''}
          ${onClick || onDoubleClick ? 'hover:bg-white/20' : ''}
        `}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
        title={alt}
      >
        {isEmoji ? (
          <span className="select-none">{src}</span>
        ) : (
          <img src={src} alt={alt} className="w-full h-full object-contain" draggable={false} />
        )}
      </div>

      {/* Label */}
      {label && (
        <div
          className="
          mt-1 px-2 py-1 
          text-xs text-white font-medium
          bg-black/50 rounded
          max-w-[80px] text-center
          truncate
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
        "
        >
          {label}
        </div>
      )}
    </div>
  )
}
