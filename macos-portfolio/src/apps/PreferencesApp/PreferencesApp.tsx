import React, { useState } from 'react'
import { usePreferencesStore } from '@/store'
import { useBattery } from '@/hooks'
import type { AppInstance } from '@/types'

interface PreferencesAppProps {
  appInstance: AppInstance
}

export const PreferencesApp: React.FC<PreferencesAppProps> = () => {
  const { wallpaper, dockPosition, updatePreference } = usePreferencesStore()
  const [activeTab, setActiveTab] = useState<
    'general' | 'appearance' | 'dock' | 'battery' | 'accessibility'
  >('general')
  const { level: batteryLevel, isCharging, isSupported } = useBattery()
  const [batteryHealth] = useState('Normal')

  const wallpapers = [
    { id: '/img/ui/wallpaper.jpg', name: 'Default' },
    { id: '/img/ui/wallpaper-day.jpg', name: 'Day' },
    { id: '/img/ui/wallpaper-night.jpg', name: 'Night' },
    { id: 'gradient-blue', name: 'Blue Gradient' },
    { id: 'gradient-sunset', name: 'Sunset' },
    { id: 'gradient-ocean', name: 'Ocean' },
  ]

  return (
    <div className="w-full h-full flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-48 bg-white border-r border-gray-200 p-4">
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'general'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>⚙️</span>
              <span className="text-sm font-medium">General</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'appearance'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>🎨</span>
              <span className="text-sm font-medium">Appearance</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('dock')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'dock'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>📱</span>
              <span className="text-sm font-medium">Dock</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('battery')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'battery'
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>🔋</span>
              <span className="text-sm font-medium">Battery</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'general' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">General</h2>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">About</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version</span>
                    <span className="text-gray-900 font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Build</span>
                    <span className="text-gray-900 font-medium">2024.11.22</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">System Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Framework</span>
                    <span className="text-gray-900 font-medium">React 19</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Build Tool</span>
                    <span className="text-gray-900 font-medium">Vite 7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">State Management</span>
                    <span className="text-gray-900 font-medium">Zustand 5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Appearance</h2>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Wallpaper</h3>
                <div className="grid grid-cols-3 gap-4">
                  {wallpapers.map(wp => (
                    <button
                      key={wp.id}
                      onClick={() => updatePreference('wallpaper', wp.id)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        wallpaper === wp.id
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {wp.id.startsWith('/') ? (
                        <img
                          src={wp.id}
                          alt={wp.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{
                            background:
                              wp.id === 'gradient-blue'
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : wp.id === 'gradient-sunset'
                                  ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                                  : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          }}
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-white text-xs font-medium">{wp.name}</p>
                      </div>
                      {wallpaper === wp.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dock' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dock</h2>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Position</h3>
                <div className="flex space-x-4">
                  {(['left', 'bottom', 'right'] as const).map(position => (
                    <button
                      key={position}
                      onClick={() => updatePreference('dockPosition', position)}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        dockPosition === position
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">
                          {position === 'left' ? '←' : position === 'right' ? '→' : '↓'}
                        </div>
                        <div className="text-sm font-medium capitalize">{position}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Auto-hide on maximize</p>
                      <p className="text-xs text-gray-500">
                        Dock hides when windows are maximized
                      </p>
                    </div>
                    <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Magnification</p>
                      <p className="text-xs text-gray-500">Icons scale on hover</p>
                    </div>
                    <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'battery' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Battery</h2>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
              {/* Battery Status */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Battery Status</h3>
                <div className="space-y-4">
                  {/* Battery Visual */}
                  <div className="flex items-center space-x-4">
                    <div className="text-6xl">🔋</div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Current Charge</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {batteryLevel}%
                        </span>
                      </div>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isCharging
                              ? 'bg-green-500'
                              : batteryLevel > 20
                                ? 'bg-blue-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${batteryLevel}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        {isCharging ? '⚡ Charging' : '🔌 On Battery Power'}
                      </div>
                    </div>
                  </div>

                  {/* Battery Info */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Condition</p>
                      <p className="text-sm font-medium text-gray-900">{batteryHealth}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="text-sm font-medium text-gray-900">
                        {isCharging ? 'Charging' : 'Not Charging'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Battery Settings */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Power Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Low Power Mode</p>
                      <p className="text-xs text-gray-500">
                        Reduces energy consumption when battery is low
                      </p>
                    </div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Show battery percentage in menu bar
                      </p>
                      <p className="text-xs text-gray-500">Display exact percentage</p>
                    </div>
                    <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Optimize battery charging
                      </p>
                      <p className="text-xs text-gray-500">
                        Reduce battery aging by learning your charging routine
                      </p>
                    </div>
                    <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Battery Health */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Battery Health</h3>
                {isSupported ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      Your battery health is <strong>{batteryHealth}</strong>. The battery is
                      functioning normally and delivering optimal performance.
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>Battery API not available</strong> - Your browser doesn't support
                      the Battery Status API. Showing simulated battery data for demonstration
                      purposes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
