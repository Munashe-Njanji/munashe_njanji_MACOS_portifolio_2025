import React, { useRef, useEffect } from 'react'
import type { NotificationCenterProps } from '@/types/components'
import { createNotificationSlideInAnimation } from '@/utils/animations'
import { NotificationToast } from './NotificationToast'

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  doNotDisturb,
  onToggleDoNotDisturb,
  onDismiss,
  onClearAll,
}) => {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (panelRef.current && isOpen) {
      createNotificationSlideInAnimation(panelRef.current)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998] bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div
        ref={panelRef}
        className="
          fixed right-0 top-0 bottom-0 z-[9999]
          w-[380px] bg-white/95 backdrop-blur-md
          border-l border-gray-200/50
          shadow-2xl
          flex flex-col
        "
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Notification Center</h2>
            <button
              onClick={onClose}
              className="
                p-1 rounded hover:bg-gray-200/50
                transition-colors text-gray-600 hover:text-gray-800
              "
              title="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {/* Do Not Disturb Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌙</span>
              <span className="text-sm font-medium text-gray-700">Do Not Disturb</span>
            </div>
            <button
              onClick={onToggleDoNotDisturb}
              className={`
                relative w-12 h-6 rounded-full transition-colors duration-200
                ${doNotDisturb ? 'bg-blue-500' : 'bg-gray-300'}
              `}
            >
              <div
                className={`
                  absolute top-0.5 w-5 h-5 rounded-full bg-white
                  transition-transform duration-200 shadow-md
                  ${doNotDisturb ? 'translate-x-6' : 'translate-x-0.5'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-gray-500 font-medium">No Notifications</p>
              <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <>
              {notifications.map(notification => (
                <NotificationToast
                  key={notification.id}
                  notification={notification}
                  onDismiss={() => onDismiss(notification.id)}
                  onClick={notification.actionable?.action}
                />
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200/50">
            <button
              onClick={onClearAll}
              className="
                w-full py-2 px-4
                bg-gray-100 hover:bg-gray-200
                text-gray-700 font-medium text-sm
                rounded-lg transition-colors
              "
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </>
  )
}
