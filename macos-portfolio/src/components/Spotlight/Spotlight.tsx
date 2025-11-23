import React, { useRef, useEffect, useCallback } from 'react'
import type { SpotlightProps } from '@/types/components'
import { useSpotlightStore } from '@/store'
import { createSpotlightOpenAnimation } from '@/utils/animations'
import { SearchResults } from './SearchResults'

export const Spotlight: React.FC<SpotlightProps> = ({ isOpen, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { query, setQuery, results, search } = useSpotlightStore()

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Animate on mount/unmount
  useEffect(() => {
    if (overlayRef.current && isOpen) {
      createSpotlightOpenAnimation(overlayRef.current)
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Space to toggle
      if (e.metaKey && e.key === ' ') {
        e.preventDefault()
        if (isOpen) {
          onClose()
        }
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value
      setQuery(newQuery)
      search(newQuery)
    },
    [setQuery, search]
  )

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="
        fixed inset-0 z-[9999]
        bg-black/40 backdrop-blur-sm
        flex items-start justify-center
        pt-16 md:pt-32
      "
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-2xl px-2 md:px-4">
        {/* Search input */}
        <div
          className="
            theme-window
            rounded-xl shadow-2xl
            overflow-hidden
            transition-all duration-300
          "
          style={{
            background: 'var(--theme-windowBackground)',
            backdropFilter: 'blur(var(--theme-blur))',
          }}
        >
          {/* Input field */}
          <div className="flex items-center px-3 md:px-4 py-2 md:py-3 border-b" style={{ borderColor: 'var(--theme-windowBorder)' }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-gray-400 mr-2 md:mr-3 flex-shrink-0"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Spotlight Search"
              className="
                theme-text-primary
                flex-1 text-base md:text-lg outline-none
                bg-transparent
                placeholder-gray-400
                transition-colors duration-300
              "
              style={{ color: 'var(--theme-textPrimary)' }}
            />
          </div>

          {/* Search results */}
          {query && <SearchResults results={results} onClose={onClose} />}
        </div>
      </div>
    </div>
  )
}
