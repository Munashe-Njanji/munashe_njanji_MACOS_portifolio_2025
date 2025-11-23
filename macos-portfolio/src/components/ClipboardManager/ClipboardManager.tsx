import React, { useEffect, useCallback } from 'react'
import { useClipboardStore } from '@/store/clipboardStore'
import { ClipboardEntry } from './ClipboardEntry'

export const ClipboardManager: React.FC = () => {
  const {
    entries,
    addEntry,
    clearHistory,
    syncToFinder,
    toggleFinderSync,
    initializeClipboardFolder,
  } = useClipboardStore()
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  // Initialize clipboard folder on mount
  useEffect(() => {
    initializeClipboardFolder()
  }, [initializeClipboardFolder])

  // Reset selected index when entries change
  useEffect(() => {
    if (selectedIndex >= entries.length) {
      setSelectedIndex(Math.max(0, entries.length - 1))
    }
  }, [entries.length, selectedIndex])

  // Handle paste action
  const handlePaste = useCallback(async (content: string) => {
    try {
      // Write to clipboard
      await navigator.clipboard.writeText(content)
      setIsOpen(false)
    } catch (err) {
      console.error('Failed to write to clipboard:', err)
    }
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Shift+V to toggle clipboard manager
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'v') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        setSelectedIndex(0)
      }

      if (!isOpen) return

      // Close on Escape
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
      }

      // Arrow key navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(entries.length - 1, prev + 1))
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(0, prev - 1))
      }

      // Enter to paste selected entry
      if (e.key === 'Enter' && entries[selectedIndex]) {
        e.preventDefault()
        handlePaste(entries[selectedIndex].content)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, entries, selectedIndex, handlePaste])

  // Listen for copy and cut events
  useEffect(() => {
    const handleCopyOrCut = async () => {
      // Small delay to ensure clipboard is updated
      setTimeout(async () => {
        try {
          const text = await navigator.clipboard.readText()
          if (text && text.trim()) {
            addEntry(text, 'text')
          }
        } catch {
          // Fallback to selection if clipboard API fails
          const selection = window.getSelection()?.toString()
          if (selection && selection.trim()) {
            addEntry(selection, 'text')
          }
        }
      }, 10)
    }

    document.addEventListener('copy', handleCopyOrCut)
    document.addEventListener('cut', handleCopyOrCut)
    
    return () => {
      document.removeEventListener('copy', handleCopyOrCut)
      document.removeEventListener('cut', handleCopyOrCut)
    }
  }, [addEntry])

  const handleClickOutside = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }, [])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={handleClickOutside}
    >
      <div className="w-[600px] max-h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Clipboard History
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Press Cmd+Shift+V to toggle
              </p>
            </div>
            <button
              onClick={clearHistory}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              Clear All
            </button>
          </div>
          
          {/* Finder Sync Toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Sync to Finder
              </span>
            </div>
            <button
              onClick={toggleFinderSync}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                syncToFinder ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  syncToFinder ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
              <svg
                className="w-16 h-16 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium">No clipboard history</p>
              <p className="text-sm">Copy some text to get started</p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <ClipboardEntry
                key={entry.id}
                entry={entry}
                onPaste={handlePaste}
                isSelected={index === selectedIndex}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Click an entry to paste it • Press Esc to close
          </p>
        </div>
      </div>
    </div>
  )
}
