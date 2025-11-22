import React, { useState, useEffect } from 'react'
import { useBattery } from '@/hooks/useBattery'

interface LockScreenProps {
  onUnlock: () => void
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [time, setTime] = useState(new Date())
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [password, setPassword] = useState('')
  const [shake, setShake] = useState(false)
  const { level, isCharging } = useBattery()

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = () => {
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDate = () => {
    return time.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleClick = () => {
    if (!showPasswordInput) {
      setShowPasswordInput(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For demo purposes, any password works, or just press Enter
    if (password.length >= 0) {
      onUnlock()
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setPassword('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showPasswordInput) {
      setShowPasswordInput(true)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 text-white/90 text-sm font-medium z-10">
        <div className="flex items-center space-x-4">
          {/* WiFi Icon */}
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3.5c3.432 0 6.124 1.534 8.054 3.241a.75.75 0 01-1.054 1.068C15.326 6.438 13.036 5.25 10 5.25S4.674 6.438 2.946 7.809A.75.75 0 011.892 6.74C3.876 5.034 6.568 3.5 10 3.5zm0 3.5c2.213 0 4.02.895 5.314 2.045a.75.75 0 11-1.014 1.105C13.408 9.395 11.89 8.75 10 8.75s-3.408.645-4.3 1.4a.75.75 0 11-1.014-1.105C5.98 7.895 7.787 7 10 7zm0 3.5c1.146 0 2.054.328 2.746.828a.75.75 0 11-.992 1.124c-.414-.3-.98-.452-1.754-.452s-1.34.152-1.754.452a.75.75 0 11-.992-1.124C7.946 10.828 8.854 10.5 10 10.5zm0 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
          </svg>
        </div>
        <div className="flex items-center space-x-4">
          {/* Battery */}
          <div className="flex items-center space-x-1">
            <span className="text-xs">{Math.round(level)}%</span>
            <div className="relative w-6 h-3">
              {/* Battery body */}
              <div
                className={`absolute inset-0 rounded-sm ${isCharging ? 'bg-green-500' : 'border border-white/60'}`}
              >
                {!isCharging && (
                  <div
                    className="absolute inset-0.5 bg-white rounded-sm transition-all"
                    style={{ width: `${level}%` }}
                  />
                )}
                {isCharging && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572L6.694 16.596a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0016.25 6H9.678l2.628-4.093z" />
                    </svg>
                  </div>
                )}
              </div>
              {/* Battery tip */}
              <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-white/60 rounded-r" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Time */}
        <div className="text-white text-8xl font-light tracking-tight mb-2 drop-shadow-lg">
          {formatTime()}
        </div>

        {/* Date */}
        <div className="text-white text-2xl font-light mb-16 drop-shadow-lg">
          {formatDate()}
        </div>

        {/* User Avatar and Login */}
        {!showPasswordInput ? (
          <div className="flex flex-col items-center space-y-4 animate-fade-in">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-5xl font-semibold shadow-2xl border-4 border-white/30">
              MN
            </div>

            {/* Name */}
            <div className="text-white text-2xl font-medium drop-shadow-lg">
              Munashe Njanji
            </div>

            {/* Hint */}
            <div className="text-white/80 text-sm font-light drop-shadow">
              Click or press Enter to continue
            </div>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center space-y-4 animate-fade-in ${shake ? 'animate-shake' : ''}`}
          >
            {/* Avatar (smaller) */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-semibold shadow-2xl border-4 border-white/30">
              MN
            </div>

            {/* Name */}
            <div className="text-white text-xl font-medium drop-shadow-lg">
              Munashe Njanji
            </div>

            {/* Password Input */}
            <form onSubmit={handleSubmit} className="w-80">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-white placeholder-white/60 text-center focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  autoFocus
                />
              </div>
              <div className="text-center mt-3 text-white/70 text-sm">
                Press Enter or type any password
              </div>
            </form>

            {/* Cancel */}
            <button
              onClick={e => {
                e.stopPropagation()
                setShowPasswordInput(false)
                setPassword('')
              }}
              className="text-white/80 hover:text-white text-sm font-light transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      {!showPasswordInput && (
        <div className="absolute bottom-8 left-0 right-0 text-center text-white/60 text-sm font-light z-10">
          Munashe Njanji  Portfolio • Press any key to wake
        </div>
      )}

      {/* Shake Animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}
