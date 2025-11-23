import React from 'react'
import type { ClipboardEntry as ClipboardEntryType } from '@/store/clipboardStore'

interface ClipboardEntryProps {
  entry: ClipboardEntryType
  onPaste: (content: string) => void
  isSelected?: boolean
}

export const ClipboardEntry: React.FC<ClipboardEntryProps> = ({
  entry,
  onPaste,
  isSelected = false,
}) => {
  const [formattedTime, setFormattedTime] = React.useState('')

  React.useEffect(() => {
    const formatTimestamp = (timestamp: number) => {
      const now = Date.now()
      const diff = now - timestamp
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)

      if (days > 0) return `${days}d ago`
      if (hours > 0) return `${hours}h ago`
      if (minutes > 0) return `${minutes}m ago`
      return 'Just now'
    }

    setFormattedTime(formatTimestamp(entry.timestamp))

    // Update every minute
    const interval = setInterval(() => {
      setFormattedTime(formatTimestamp(entry.timestamp))
    }, 60000)

    return () => clearInterval(interval)
  }, [entry.timestamp])

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const getTypeIcon = () => {
    switch (entry.type) {
      case 'html':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        )
      case 'image':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )
    }
  }

  return (
    <button
      onClick={() => onPaste(entry.content)}
      className={`w-full p-3 rounded-lg border transition-colors text-left group ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-500'
          : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors">
          {getTypeIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words font-mono">
            {truncateContent(entry.content)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formattedTime}
          </p>
        </div>
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
      </div>
    </button>
  )
}
