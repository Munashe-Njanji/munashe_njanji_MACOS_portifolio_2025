import React, { useState, useCallback, useRef } from 'react'
import type { SafariAppProps } from '@/types/components'
import { useSafariStore, useUIStore } from '@/store'
import type { MenuItem } from '@/types'

// Favorite sites configuration - personalized for Munashe Njanji
const favoriteSites = [
  { id: 'github-profile', title: 'My GitHub', url: 'https://github.com/Munashe-Njanji', icon: '💻', iframeFriendly: false },
  { id: 'linkedin', title: 'LinkedIn', url: 'https://www.linkedin.com/in/munashe-njanji-9ab254174_hey-everyone-im-munashe-njanji-a-talented-activity-7044645981321080834-bFxu', icon: '💼', iframeFriendly: false },
  { id: 'stackoverflow', title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '💡', iframeFriendly: true },
  { id: 'mdn', title: 'MDN Docs', url: 'https://developer.mozilla.org', icon: '📖', iframeFriendly: true },
  { id: 'react', title: 'React Docs', url: 'https://react.dev', icon: '⚛️', iframeFriendly: true },
  { id: 'tailwind', title: 'Tailwind CSS', url: 'https://tailwindcss.com', icon: '🎨', iframeFriendly: true },
  { id: 'ubuntu', title: 'Ubuntu', url: 'https://ubuntu.com', icon: '🐧', iframeFriendly: true },
  { id: 'bing', title: 'Bing Search', url: 'https://www.bing.com', icon: '🔍', iframeFriendly: true },
]

// Check if URL is valid
const checkURL = (url: string): boolean => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(url)
}

export const SafariApp: React.FC<SafariAppProps> = () => {
  const [goURL, setGoURL] = useState<string>('')
  const [currentURL, setCurrentURL] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useSafariStore()
  const { showContextMenu } = useUIStore()

  // Navigate to URL
  const handleNavigate = useCallback((url: string, addToHistory = true) => {
    const isValid = checkURL(url)
    let finalURL = url

    if (isValid) {
      if (url.substring(0, 7) !== 'http://' && url.substring(0, 8) !== 'https://') {
        finalURL = `https://${url}`
      }
    } else if (url !== '') {
      // Use Bing for search
      finalURL = `https://www.bing.com/search?q=${encodeURIComponent(url)}`
    }

    setGoURL(finalURL)
    setCurrentURL(finalURL)
    setIsLoading(true)

    // Update history
    if (addToHistory && finalURL) {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1)
        newHistory.push(finalURL)
        return newHistory
      })
      setHistoryIndex(prev => prev + 1)
    }
  }, [historyIndex])

  // Handle URL input submission
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleNavigate(currentURL)
      }
    },
    [currentURL, handleNavigate]
  )

  // Go back
  const handleBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const newURL = history[newIndex]
      setHistoryIndex(newIndex)
      setGoURL(newURL)
      setCurrentURL(newURL)
      setIsLoading(true)
    } else {
      // Go to start page
      setGoURL('')
      setCurrentURL('')
    }
  }, [history, historyIndex])

  // Go forward
  const handleForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const newURL = history[newIndex]
      setHistoryIndex(newIndex)
      setGoURL(newURL)
      setCurrentURL(newURL)
      setIsLoading(true)
    }
  }, [history, historyIndex])

  // Reload current page
  const handleReload = useCallback(() => {
    if (iframeRef.current && goURL) {
      setIsLoading(true)
      iframeRef.current.src = goURL
    }
  }, [goURL])

  // Handle iframe load
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Handle bookmark toggle
  const handleBookmarkToggle = useCallback(() => {
    if (!goURL) return

    if (isBookmarked(goURL)) {
      const bookmark = bookmarks.find(b => b.url === goURL)
      if (bookmark) {
        removeBookmark(bookmark.id)
      }
    } else {
      // Extract title from URL or use URL as title
      const title = goURL.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] || goURL
      addBookmark(title, goURL)
    }
  }, [goURL, isBookmarked, bookmarks, addBookmark, removeBookmark])

  // Navigate to bookmarked URL
  const handleBookmarkClick = useCallback(
    (bookmarkUrl: string) => {
      handleNavigate(bookmarkUrl)
      setShowBookmarks(false)
    },
    [handleNavigate]
  )

  // Navigate to favorite site
  const handleFavoriteClick = useCallback(
    (url: string, iframeFriendly: boolean) => {
      if (iframeFriendly) {
        handleNavigate(url)
      } else {
        // Open in new tab for sites that block iframes
        window.open(url, '_blank')
      }
    },
    [handleNavigate]
  )

  const canGoBack = historyIndex > 0 || goURL !== ''
  const canGoForward = historyIndex < history.length - 1
  const currentlyBookmarked = goURL ? isBookmarked(goURL) : false

  // Handle context menu
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const menuItems: MenuItem[] = [
        {
          id: 'back',
          label: 'Back',
          icon: '←',
          action: handleBack,
          disabled: !canGoBack,
        },
        {
          id: 'forward',
          label: 'Forward',
          icon: '→',
          action: handleForward,
          disabled: !canGoForward,
        },
        {
          id: 'reload',
          label: 'Reload',
          icon: '🔄',
          action: handleReload,
          disabled: !goURL,
        },
        {
          id: 'separator-1',
          label: '',
          separator: true,
          action: () => {},
        },
        {
          id: 'bookmark',
          label: currentlyBookmarked ? 'Remove Bookmark' : 'Add Bookmark',
          icon: currentlyBookmarked ? '⭐' : '☆',
          action: handleBookmarkToggle,
          disabled: !goURL,
        },
        {
          id: 'bookmarks',
          label: 'Show Bookmarks',
          icon: '📚',
          action: () => setShowBookmarks(prev => !prev),
        },
      ]

      showContextMenu(e.clientX, e.clientY, menuItems)
    },
    [
      canGoBack,
      canGoForward,
      goURL,
      currentlyBookmarked,
      handleBack,
      handleForward,
      handleReload,
      handleBookmarkToggle,
      showContextMenu,
    ]
  )

  return (
    <div className="w-full h-full flex flex-col bg-white" onContextMenu={handleContextMenu}>
      {/* Address Bar */}
      <div className="h-12 px-4 flex items-center space-x-2 border-b border-gray-300 bg-gray-50">
        {/* Navigation Buttons */}
        <button
          onClick={handleBack}
          disabled={!canGoBack}
          className="p-2 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
          title="Back"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={handleForward}
          disabled={!canGoForward}
          className="p-2 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
          title="Forward"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <button
          onClick={handleReload}
          disabled={!goURL}
          className="p-2 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
          title="Reload"
        >
          <svg
            className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>

        {/* URL Input */}
        <div className="flex-1">
          <input
            type="text"
            value={currentURL}
            onChange={(e) => setCurrentURL(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center"
            placeholder="Search or enter website name"
          />
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkToggle}
          disabled={!goURL}
          className={`p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
            currentlyBookmarked ? 'text-blue-500' : 'text-gray-600'
          }`}
          title={currentlyBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <svg
            className="w-5 h-5"
            fill={currentlyBookmarked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>

        {/* Bookmarks Toggle */}
        <button
          onClick={() => setShowBookmarks(!showBookmarks)}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Show bookmarks"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Bookmarks Panel */}
      {showBookmarks && (
        <div className="bg-white border-b border-gray-300 max-h-64 overflow-y-auto">
          {bookmarks.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No bookmarks yet. Click the bookmark icon to save pages.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bookmarks.map(bookmark => (
                <div
                  key={bookmark.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 group"
                >
                  <button
                    onClick={() => handleBookmarkClick(bookmark.url)}
                    className="flex-1 text-left"
                  >
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {bookmark.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {bookmark.url}
                    </div>
                  </button>
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove bookmark"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && <div className="h-1 bg-blue-500 animate-pulse" />}

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {goURL === '' ? (
          /* Start Page */
          <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="max-w-4xl mx-auto py-12 px-6">
              {/* Favorites Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Favorites</h2>
                <div className="grid grid-cols-4 gap-6">
                  {favoriteSites.map(site => (
                    <button
                      key={site.id}
                      onClick={() => handleFavoriteClick(site.url, site.iframeFriendly)}
                      className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group relative"
                    >
                      <div className="w-16 h-16 flex items-center justify-center text-4xl mb-3 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform">
                        {site.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{site.title}</span>
                      {!site.iframeFriendly && (
                        <span className="absolute top-2 right-2 text-xs text-gray-400" title="Opens in new tab">
                          ↗
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookmarks Section */}
              {bookmarks.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Bookmarks</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {bookmarks.map(bookmark => (
                      <button
                        key={bookmark.id}
                        onClick={() => handleBookmarkClick(bookmark.url)}
                        className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {bookmark.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{bookmark.url}</div>
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            removeBookmark(bookmark.id)
                          }}
                          className="ml-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Report */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Privacy Report</h2>
                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-3xl font-bold text-gray-900">
                      {Math.floor(Math.random() * 99 + 1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    In the last seven days, Safari has prevented trackers from profiling you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Website iframe */
          <iframe
            ref={iframeRef}
            src={goURL}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-top-navigation-by-user-activation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={handleIframeLoad}
            title="Safari Browser Content"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>
    </div>
  )
}
