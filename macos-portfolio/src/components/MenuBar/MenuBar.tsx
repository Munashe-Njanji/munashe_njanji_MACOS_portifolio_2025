import React, { useState, useEffect, useRef } from 'react'
import type { MenuBarProps } from '@/types/components'
import { useWindowStore } from '@/store'
import { useBattery, useNetwork } from '@/hooks'
import { Calendar } from './Calendar'

export const MenuBar: React.FC<MenuBarProps> = ({
  onSpotlightClick,
  onNotificationCenterClick,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [appleMenuOpen, setAppleMenuOpen] = useState(false)
  const [batteryMenuOpen, setBatteryMenuOpen] = useState(false)
  const [wifiMenuOpen, setWifiMenuOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const appleMenuRef = useRef<HTMLDivElement>(null)
  const batteryMenuRef = useRef<HTMLDivElement>(null)
  const wifiMenuRef = useRef<HTMLDivElement>(null)
  const calendarMenuRef = useRef<HTMLDivElement>(null)
  const { openWindow } = useWindowStore()
  const { level: batteryLevel, isCharging } = useBattery()
  const { isOnline, effectiveType, downlink, rtt, type, isSupported } = useNetwork()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (appleMenuRef.current && !appleMenuRef.current.contains(event.target as Node)) {
        setAppleMenuOpen(false)
      }
      if (batteryMenuRef.current && !batteryMenuRef.current.contains(event.target as Node)) {
        setBatteryMenuOpen(false)
      }
      if (wifiMenuRef.current && !wifiMenuRef.current.contains(event.target as Node)) {
        setWifiMenuOpen(false)
      }
      if (calendarMenuRef.current && !calendarMenuRef.current.contains(event.target as Node)) {
        setCalendarOpen(false)
      }
    }

    if (appleMenuOpen || batteryMenuOpen || wifiMenuOpen || calendarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [appleMenuOpen, batteryMenuOpen, wifiMenuOpen, calendarOpen])

  const getWifiStrength = () => {
    if (!isOnline) return 0
    if (effectiveType === '4g') return 3
    if (effectiveType === '3g') return 2
    if (effectiveType === '2g') return 1
    return 3
  }

  const wifiStrength = getWifiStrength()

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const handleAboutThisMac = () => {
    setAppleMenuOpen(false)
    // Could open an About dialog
  }

  const handleSystemPreferences = () => {
    setAppleMenuOpen(false)
    openWindow('preferences')
  }

  const handleSleep = () => {
    setAppleMenuOpen(false)
    // Simulate sleep - could fade screen to black
    console.log('Sleep mode activated')
  }

  const handleRestart = () => {
    setAppleMenuOpen(false)
    if (confirm('Are you sure you want to restart?')) {
      window.location.reload()
    }
  }

  const handleShutDown = () => {
    setAppleMenuOpen(false)
    if (confirm('Are you sure you want to shut down?')) {
      window.close()
    }
  }

  const handleLockScreen = () => {
    setAppleMenuOpen(false)
    // Could show a lock screen overlay
    console.log('Screen locked')
  }

  const handleLogout = () => {
    setAppleMenuOpen(false)
    if (confirm('Are you sure you want to log out?')) {
      // Clear all windows and reset state
      window.location.reload()
    }
  }

  return (
    <div
      className="
      theme-menubar
      fixed top-0 left-0 right-0 z-[9999]
      h-6
      border-b border-gray-200/50
      flex items-center justify-between
      px-2 md:px-4 text-xs md:text-sm font-medium
      select-none
      transition-colors duration-300
    "
    >
      {/* Left side - App menu */}
      <div className="flex items-center space-x-1 md:space-x-3 flex-shrink-0">
        <div className="relative" ref={appleMenuRef}>
          <button
            onClick={() => setAppleMenuOpen(!appleMenuOpen)}
            className="flex items-center space-x-1 md:space-x-2 px-1 md:px-2 py-1 rounded theme-hover transition-colors"
          >
            <svg
              className="w-3 h-3 md:w-4 md:h-4"
              style={{ color: 'var(--theme-menuBarText)' }}
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
            </svg>
          </button>

          {/* Apple Menu Dropdown */}
          {appleMenuOpen && (
            <div className="theme-window absolute left-0 top-full mt-1 w-56 rounded-lg shadow-lg py-1 z-[10000]" style={{ backdropFilter: 'blur(20px)' }}>
              {/* About */}
              <button
                onClick={handleAboutThisMac}
                className="theme-text-primary w-full px-4 py-1.5 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors"
              >
                About This Mac
              </button>

              <div className="h-px my-1" style={{ background: 'var(--theme-windowBorder)' }} />

              {/* System Preferences & App Store */}
              <button
                onClick={handleSystemPreferences}
                className="theme-text-primary w-full px-4 py-1.5 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors"
              >
                System Preferences...
              </button>
              <button className="theme-text-primary w-full px-4 py-1.5 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors">
                App Store...
              </button>

              <div className="h-px my-1" style={{ background: 'var(--theme-windowBorder)' }} />

              {/* Recent Items */}
              <button className="theme-text-primary w-full px-4 py-1.5 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors">
                Recent Items
              </button>

              <div className="h-px my-1" style={{ background: 'var(--theme-windowBorder)' }} />

              {/* Force Quit */}
              <button className="theme-text-primary w-full px-4 py-1.5 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors">
                Force Quit...
              </button>

              <div className="h-px my-1" style={{ background: 'var(--theme-windowBorder)' }} />

              {/* Sleep, Restart, Shut Down */}
              <button
                onClick={handleSleep}
                className="theme-text-primary w-full px-4 py-1.5 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors"
              >
                Sleep
              </button>
              <button
                onClick={handleRestart}
                className="theme-text-primary w-full px-4 py-1.5 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors"
              >
                Restart...
              </button>
              <button
                onClick={handleShutDown}
                className="theme-text-primary w-full px-4 py-1.5 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors"
              >
                Shut Down...
              </button>

              <div className="h-px my-1" style={{ background: 'var(--theme-windowBorder)' }} />

              {/* Lock & Logout */}
              <button
                onClick={handleLockScreen}
                className="theme-text-primary w-full px-4 py-1.5 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors"
              >
                Lock Screen
              </button>
              <button
                onClick={handleLogout}
                className="theme-text-primary w-full px-4 py-1.5 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors"
              >
                Log Out User...
              </button>
            </div>
          )}
        </div>

        <span className="font-semibold text-xs md:text-sm truncate max-w-[120px] md:max-w-none" style={{ color: 'var(--theme-menuBarText)' }}>
          Munashe Njanji Portfolio
        </span>

        <div className="hidden lg:flex items-center space-x-3" style={{ color: 'var(--theme-menuBarText)' }}>
          <button className="hover:opacity-80 transition-opacity">File</button>
          <button className="hover:opacity-80 transition-opacity">Edit</button>
          <button className="hover:opacity-80 transition-opacity">View</button>
          <button className="hover:opacity-80 transition-opacity">Window</button>
          <button className="hover:opacity-80 transition-opacity">Help</button>
        </div>
      </div>

      {/* Right side - Status icons and time */}
      <div className="flex items-center space-x-1 md:space-x-3" style={{ color: 'var(--theme-menuBarText)' }}>
        {/* Battery indicator */}
        <div className="relative" ref={batteryMenuRef}>
          <button
            onClick={() => setBatteryMenuOpen(!batteryMenuOpen)}
            className="flex items-center space-x-1 px-2 py-1 rounded theme-hover transition-colors"
            style={{ color: 'var(--theme-menuBarText)' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <g>
                <path d="M3 12.338c.01.839-.015 1.451.262 1.953.138.251.373.45.666.56.292.11.64.149 1.078.149H11c.438 0 .786-.039 1.078-.148.293-.11.526-.31.664-.56.277-.503.248-1.115.258-1.954V3.631c-.01-.839.019-1.453-.258-1.955a1.25 1.25 0 0 0-.664-.559C11.786 1.007 11.438 1 11 1h-1V0H6v1h-.994c-.438 0-.786.007-1.078.117-.293.11-.528.308-.666.559-.277.502-.252 1.116-.262 1.955v8.705zm1-.014V3.633c.01-.853.04-1.298.137-1.475a.266.266 0 0 1 .142-.105c.062-.023.3-.053.727-.053H11c.427 0 .664.03.727.053a.259.259 0 0 1 .14.105c.095.173.123.618.133 1.475v8.705c-.01.854-.038 1.298-.133 1.47-.016.03-.055.074-.14.106-.123.046-.349.086-.727.086H5.006c-.378 0-.604-.04-.727-.086a.266.266 0 0 1-.142-.105c-.098-.178-.127-.62-.137-1.485z" />
                {/* Battery fill level */}
                <rect
                  x="5"
                  y={13 - (batteryLevel / 100) * 10}
                  width="6"
                  height={(batteryLevel / 100) * 10}
                  fill={isCharging ? '#34c759' : batteryLevel > 20 ? 'currentColor' : '#ff3b30'}
                />
              </g>
            </svg>
            <span className="text-xs">{batteryLevel}%</span>
          </button>

          {/* Battery Menu Dropdown */}
          {batteryMenuOpen && (
            <div className="theme-window absolute right-0 top-full mt-1 w-64 rounded-lg shadow-lg py-2 z-[10000]" style={{ backdropFilter: 'blur(20px)' }}>
              <div className="px-4 py-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="theme-text-primary text-sm font-semibold">Battery</span>
                  <span className="theme-text-secondary text-sm">{batteryLevel}%</span>
                </div>

                {/* Battery visual */}
                <div className="mb-3">
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--theme-windowBorder)' }}>
                    <div
                      className={`h-full transition-all ${
                        isCharging
                          ? 'bg-green-500'
                          : batteryLevel > 20
                            ? ''
                            : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${batteryLevel}%`,
                        background: isCharging ? undefined : (batteryLevel > 20 ? 'var(--theme-textPrimary)' : undefined)
                      }}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1 text-xs theme-text-secondary">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium">
                      {isCharging ? 'Charging' : 'On Battery Power'}
                    </span>
                  </div>
                  {isCharging && (
                    <div className="flex justify-between">
                      <span>Time until full:</span>
                      <span className="font-medium">Calculating...</span>
                    </div>
                  )}
                  {!isCharging && batteryLevel < 100 && (
                    <div className="flex justify-between">
                      <span>Time remaining:</span>
                      <span className="font-medium">
                        {Math.floor((batteryLevel / 100) * 10)}:
                        {((batteryLevel % 10) * 6).toString().padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="h-px my-2" style={{ background: 'var(--theme-windowBorder)' }} />

                <button
                  onClick={() => {
                    setBatteryMenuOpen(false)
                    openWindow('preferences')
                  }}
                  className="theme-text-primary w-full text-left px-2 py-1.5 text-xs hover:bg-blue-500 hover:text-white rounded transition-colors"
                >
                  Battery Preferences...
                </button>
              </div>
            </div>
          )}
        </div>

        {/* WiFi indicator */}
        <div className="relative" ref={wifiMenuRef}>
          <button
            onClick={() => setWifiMenuOpen(!wifiMenuOpen)}
            className="p-1 rounded theme-hover transition-colors"
            style={{ color: 'var(--theme-menuBarText)' }}
            title="WiFi"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                {!isOnline ? (
                  <>
                    <path
                      d="M0 7L1.17157 5.82843C2.98259 4.01741 5.43884 3 8 3C10.5612 3 13.0174 4.01742 14.8284 5.82843L16 7L14.5858 8.41421L13.4142 7.24264C11.9783 5.8067 10.0307 5 8 5C5.96928 5 4.02173 5.8067 2.58579 7.24264L1.41421 8.41421L0 7Z"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <line
                      x1="2"
                      y1="14"
                      x2="14"
                      y2="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </>
                ) : (
                  <>
                    <path
                      d="M0 7L1.17157 5.82843C2.98259 4.01741 5.43884 3 8 3C10.5612 3 13.0174 4.01742 14.8284 5.82843L16 7L14.5858 8.41421L13.4142 7.24264C11.9783 5.8067 10.0307 5 8 5C5.96928 5 4.02173 5.8067 2.58579 7.24264L1.41421 8.41421L0 7Z"
                      fill="currentColor"
                      opacity={wifiStrength >= 1 ? 1 : 0.3}
                    />
                    <path
                      d="M4.24264 11.2426L2.82843 9.82843L4 8.65685C5.06086 7.59599 6.49971 7 8 7C9.50029 7 10.9391 7.59599 12 8.65686L13.1716 9.82843L11.7574 11.2426L10.5858 10.0711C9.89999 9.38527 8.96986 9 8 9C7.03014 9 6.1 9.38527 5.41421 10.0711L4.24264 11.2426Z"
                      fill="currentColor"
                      opacity={wifiStrength >= 2 ? 1 : 0.3}
                    />
                    <path
                      d="M8 15L5.65685 12.6569L6.82842 11.4853C7.13914 11.1746 7.56057 11 8 11C8.43942 11 8.86085 11.1746 9.17157 11.4853L10.3431 12.6569L8 15Z"
                      fill="currentColor"
                      opacity={wifiStrength >= 3 ? 1 : 0.3}
                    />
                  </>
                )}
              </g>
            </svg>
          </button>

          {/* WiFi Menu Dropdown */}
          {wifiMenuOpen && (
            <div className="theme-window absolute right-0 top-full mt-1 w-72 rounded-lg shadow-lg py-2 z-[10000]" style={{ backdropFilter: 'blur(20px)' }}>
              <div className="px-4 py-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="theme-text-primary text-sm font-semibold">WiFi</span>
                  <span
                    className={`text-xs font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {isOnline ? 'Connected' : 'Offline'}
                  </span>
                </div>

                {isOnline && (
                  <>
                    {/* Network Name */}
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 7L1.17157 5.82843C2.98259 4.01741 5.43884 3 8 3C10.5612 3 13.0174 4.01742 14.8284 5.82843L16 7L14.5858 8.41421L13.4142 7.24264C11.9783 5.8067 10.0307 5 8 5C5.96928 5 4.02173 5.8067 2.58579 7.24264L1.41421 8.41421L0 7Z"
                              fill="currentColor"
                            />
                            <path
                              d="M4.24264 11.2426L2.82843 9.82843L4 8.65685C5.06086 7.59599 6.49971 7 8 7C9.50029 7 10.9391 7.59599 12 8.65686L13.1716 9.82843L11.7574 11.2426L10.5858 10.0711C9.89999 9.38527 8.96986 9 8 9C7.03014 9 6.1 9.38527 5.41421 10.0711L4.24264 11.2426Z"
                              fill="currentColor"
                            />
                            <path
                              d="M8 15L5.65685 12.6569L6.82842 11.4853C7.13914 11.1746 7.56057 11 8 11C8.43942 11 8.86085 11.1746 9.17157 11.4853L10.3431 12.6569L8 15Z"
                              fill="currentColor"
                            />
                          </svg>
                          <span className="text-sm font-medium text-gray-900">
                            {type === 'wifi' ? 'My Network' : type.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-blue-600">✓</span>
                      </div>
                    </div>

                    {/* Network Stats */}
                    <div className="space-y-2 text-xs theme-text-secondary mb-3">
                      <div className="flex justify-between">
                        <span>Connection Type:</span>
                        <span className="theme-text-primary font-medium capitalize">{type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Effective Type:</span>
                        <span className="theme-text-primary font-medium uppercase">
                          {effectiveType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Download Speed:</span>
                        <span className="theme-text-primary font-medium">{downlink} Mbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Latency (RTT):</span>
                        <span className="theme-text-primary font-medium">{rtt} ms</span>
                      </div>
                      {isSupported && (
                        <div className="flex justify-between">
                          <span>API Status:</span>
                          <span className="font-medium text-green-600">Active</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {!isOnline && (
                  <div className="mb-3 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-700">
                      No internet connection available. Please check your network settings.
                    </p>
                  </div>
                )}

                {!isSupported && isOnline && (
                  <div className="mb-3 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
                    Network Information API not supported. Showing simulated data.
                  </div>
                )}

                <div className="h-px my-2" style={{ background: 'var(--theme-windowBorder)' }} />

                <button
                  onClick={() => {
                    setWifiMenuOpen(false)
                    openWindow('preferences')
                  }}
                  className="theme-text-primary w-full text-left px-2 py-1.5 text-xs hover:bg-blue-500 hover:text-white rounded transition-colors"
                >
                  Network Preferences...
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Spotlight search */}
        <button
          onClick={onSpotlightClick}
          className="p-1 rounded theme-hover transition-colors"
          style={{ color: 'var(--theme-menuBarText)' }}
          title="Spotlight Search (⌘Space)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Notification Center */}
        <button
          onClick={onNotificationCenterClick}
          className="p-1 rounded theme-hover transition-colors"
          style={{ color: 'var(--theme-menuBarText)' }}
          title="Notification Center"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10,20h4a2,2,0,0,1-4,0Zm8-4V10a6,6,0,0,0-5-5.91V3a1,1,0,0,0-2,0V4.09A6,6,0,0,0,6,10v6L4,18H20Z" />
          </svg>
        </button>

        {/* Current time with calendar */}
        <div className="relative" ref={calendarMenuRef}>
          <button
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="font-medium min-w-[80px] md:min-w-[120px] text-right px-1 md:px-2 py-1 rounded theme-hover transition-colors text-xs md:text-sm"
            style={{ color: 'var(--theme-menuBarText)' }}
          >
            <span className="hidden md:inline">{formatTime(currentTime)}</span>
            <span className="md:hidden">
              {currentTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </button>

          {/* Calendar Dropdown */}
          {calendarOpen && (
            <div className="theme-window absolute right-0 top-full mt-1 w-80 rounded-lg shadow-lg py-3 z-[10000]" style={{ backdropFilter: 'blur(20px)' }}>
              <Calendar currentDate={currentTime} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
