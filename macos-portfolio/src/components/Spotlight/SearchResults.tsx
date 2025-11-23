import React, { useState, useEffect, useCallback } from 'react'
import type { SearchResult } from '@/types'

interface SearchResultsProps {
  results: SearchResult[]
  onClose: () => void
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [prevResultsLength, setPrevResultsLength] = useState(results.length)

  // Reset selection when results change (using derived state pattern)
  if (results.length !== prevResultsLength) {
    setSelectedIndex(0)
    setPrevResultsLength(results.length)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (results.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            results[selectedIndex].action()
            onClose()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [results, selectedIndex, onClose])

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      result.action()
      onClose()
    },
    [onClose]
  )

  if (results.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-gray-500">
        <div className="text-4xl mb-2">🔍</div>
        <p>No results found</p>
      </div>
    )
  }

  // Group results by type
  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = []
      }
      acc[result.type].push(result)
      return acc
    },
    {} as Record<string, SearchResult[]>
  )

  const categoryLabels: Record<string, string> = {
    app: 'Applications',
    file: 'Files',
    bookmark: 'Bookmarks',
    command: 'Commands',
    setting: 'Settings',
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      {Object.entries(groupedResults).map(([type, typeResults]) => (
        <div key={type}>
          {/* Category header */}
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
            {categoryLabels[type] || type}
          </div>

          {/* Results */}
          {typeResults.map(result => {
            const globalIndex = results.indexOf(result)
            const isSelected = globalIndex === selectedIndex

            return (
              <button
                key={result.id}
                className={`
                  w-full px-4 py-3 text-left
                  flex items-center space-x-3
                  transition-colors duration-150
                  ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-800'}
                `}
                onClick={() => handleResultClick(result)}
                onMouseEnter={() => setSelectedIndex(globalIndex)}
              >
                {/* Icon */}
                <div className="text-2xl flex-shrink-0">{result.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`
                    font-medium truncate
                    ${isSelected ? 'text-white' : 'text-gray-900'}
                  `}
                  >
                    {result.title}
                  </div>
                  {result.subtitle && (
                    <div
                      className={`
                      text-sm truncate
                      ${isSelected ? 'text-blue-100' : 'text-gray-500'}
                    `}
                    >
                      {result.subtitle}
                    </div>
                  )}
                </div>

                {/* Keyboard hint for selected item */}
                {isSelected && (
                  <div className="flex-shrink-0 text-xs text-blue-100 opacity-75">⏎</div>
                )}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
