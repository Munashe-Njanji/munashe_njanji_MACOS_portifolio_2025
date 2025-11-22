import React, { useEffect, useState } from 'react'
import type { NotificationToastProps } from '@/types/components'

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
  onClick,
}) => {
  const [timeLeft, setTimeLeft] = useState(notification.ttl)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          onDismiss()
          return 0
        }
        return prev - 100
      })
    }, 100)

    return () => clearInterval(interval)
  }, [onDismiss])

  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getTypeIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const progressPercentage = (timeLeft / notification.ttl) * 100

  return (
    <div
      className={`
        relative rounded-lg border p-3
        transition-all duration-200
        ${getTypeStyles()}
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
      `}
      onClick={onClick}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/30 rounded-b-lg overflow-hidden">
        <div
          className="h-full bg-current opacity-30 transition-all duration-100"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="text-2xl flex-shrink-0">{getTypeIcon()}</div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm">{notification.title}</h3>
            <button
              onClick={e => {
                e.stopPropagation()
                onDismiss()
              }}
              className="
                ml-2 p-0.5 rounded hover:bg-black/10
                transition-colors flex-shrink-0
              "
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          <p className="text-xs mt-1 opacity-90">{notification.body}</p>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs opacity-70">{formatTime(notification.timestamp)}</span>

            {notification.actionable && (
              <button
                onClick={e => {
                  e.stopPropagation()
                  notification.actionable?.action()
                  onDismiss()
                }}
                className="
                  text-xs font-medium px-2 py-1 rounded
                  bg-current/10 hover:bg-current/20
                  transition-colors
                "
              >
                {notification.actionable.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
