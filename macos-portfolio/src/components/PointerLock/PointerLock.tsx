import React, { useEffect, useState } from 'react'

interface PointerLockProps {
  isLocked: boolean
  onLockChange: (locked: boolean) => void
}

export const PointerLock: React.FC<PointerLockProps> = ({ isLocked, onLockChange }) => {
  const [showInstructions, setShowInstructions] = useState(true)

  useEffect(() => {
    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement !== null
      onLockChange(locked)
    }

    const handlePointerLockError = () => {
      console.error('Pointer lock failed')
      onLockChange(false)
    }

    document.addEventListener('pointerlockchange', handlePointerLockChange)
    document.addEventListener('pointerlockerror', handlePointerLockError)

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
      document.removeEventListener('pointerlockerror', handlePointerLockError)
    }
  }, [onLockChange])

  // Hide instructions after 5 seconds
  useEffect(() => {
    if (showInstructions) {
      const timer = setTimeout(() => {
        setShowInstructions(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showInstructions])

  if (!showInstructions && !isLocked) return null

  return (
    <>
      {/* Instructions overlay when not locked */}
      {!isLocked && showInstructions && (
        <div className="fixed inset-0 z-[9997] pointer-events-none flex items-center justify-center">
          <div className="bg-black/80 backdrop-blur-md text-white px-8 py-6 rounded-2xl shadow-2xl max-w-md pointer-events-auto">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl">🖱️</div>
              <h3 className="text-xl font-semibold">Virtual Desktop Mode</h3>
            </div>
            <div className="space-y-3 text-sm">
              <p className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>
                  <strong>Click anywhere</strong> to capture mouse and keyboard control
                </span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>
                  Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Esc</kbd> to release
                  control and return to your OS
                </span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>All macOS shortcuts work: Alt+Tab, Cmd+Space, F3, etc.</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-green-400 font-bold">✓</span>
                <span className="text-green-300">
                  <strong>Windows users:</strong> Use Alt instead of Cmd for shortcuts
                </span>
              </p>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Status indicator when locked */}
      {isLocked && (
        <>
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9998] pointer-events-none">
            <div className="bg-green-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-3 animate-fade-in">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                Virtual Desktop Active • Press <kbd className="px-2 py-0.5 bg-white/20 rounded text-xs">Esc</kbd> to exit
              </span>
            </div>
          </div>

          {/* Corner indicators */}
          <div className="fixed top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-green-500/50 z-[9997] pointer-events-none" />
          <div className="fixed top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-green-500/50 z-[9997] pointer-events-none" />
          <div className="fixed bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-green-500/50 z-[9997] pointer-events-none" />
          <div className="fixed bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-green-500/50 z-[9997] pointer-events-none" />
        </>
      )}
    </>
  )
}
