import React, { useState } from 'react'
import { usePreferencesStore } from '@/store'
import { useBattery } from '@/hooks'
import type { AppInstance } from '@/types'
import type { ThemeMode, AccentColor, DeveloperTheme } from '@/types/theme'
import { themePresets, accentColors } from '@/utils/themePresets'

interface PreferencesAppProps {
  appInstance: AppInstance
}

export const PreferencesApp: React.FC<PreferencesAppProps> = () => {
  const {
    wallpaper,
    dockPosition,
    themeMode,
    accentColor,
    developerTheme,
    setThemeMode,
    setAccentColor,
    setDeveloperTheme,
    updatePreference,
  } = usePreferencesStore()
  const [activeTab, setActiveTab] = useState<
    'general' | 'appearance' | 'themes' | 'dock' | 'battery' | 'accessibility'
  >('themes')
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

  const themeModes: { id: ThemeMode; name: string; description: string; icon: string }[] = [
    { id: 'light', name: 'Light', description: 'Classic light theme', icon: '☀️' },
    { id: 'dark', name: 'Dark', description: 'Dark theme for low-light', icon: '🌙' },
    { id: 'auto', name: 'Auto', description: 'Follows system preference', icon: '🔄' },
    {
      id: 'high-contrast',
      name: 'High Contrast',
      description: 'Maximum contrast',
      icon: '◐',
    },
    { id: 'oled', name: 'OLED Black', description: 'True black for OLED', icon: '⬛' },
    { id: 'developer', name: 'Developer', description: 'Code editor themes', icon: '💻' },
  ]

  const developerThemes: { id: DeveloperTheme; name: string; description: string }[] = [
    { id: 'neon-matrix', name: 'Neon Matrix', description: 'Cyberpunk green aesthetic' },
    { id: 'monokai-pro', name: 'Monokai Pro', description: 'Popular editor theme' },
    { id: 'dracula-ui', name: 'Dracula UI', description: 'Dark with vibrant colors' },
  ]

  return (
    <div className="theme-app-bg w-full h-full flex">
      {/* Sidebar */}
      <div className="theme-sidebar w-48 border-r p-4">
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'general'
                ? 'theme-accent-bg text-white'
                : 'theme-text-primary theme-hover'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>⚙️</span>
              <span className="text-sm font-medium">General</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('themes')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'themes'
                ? 'theme-accent-bg text-white'
                : 'theme-text-primary theme-hover'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>🎨</span>
              <span className="text-sm font-medium">Themes</span>
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
              <span>🖼️</span>
              <span className="text-sm font-medium">Wallpaper</span>
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

        {activeTab === 'themes' && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Theme Customization</h2>

            {/* Theme Mode Selection */}
            <div className="theme-card rounded-xl p-6 shadow-sm mb-6">
              <h3 className="text-sm font-semibold theme-text-primary mb-4">Theme Mode</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {themeModes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setThemeMode(mode.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      themeMode === mode.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'theme-card hover:border-gray-400'
                    }`}
                    style={{
                      borderColor: themeMode === mode.id ? 'var(--theme-accent)' : undefined,
                    }}
                  >
                    <div className="text-3xl mb-2">{mode.icon}</div>
                    <div className="font-semibold theme-text-primary mb-1">{mode.name}</div>
                    <div className="text-xs theme-text-secondary">{mode.description}</div>
                    {themeMode === mode.id && (
                      <div className="mt-2 theme-accent text-xs font-medium">✓ Active</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Developer Themes (only show if developer mode selected) */}
            {themeMode === 'developer' && (
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Developer Themes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {developerThemes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setDeveloperTheme(theme.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        developerTheme === theme.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 mb-1">{theme.name}</div>
                      <div className="text-xs text-gray-600 mb-2">{theme.description}</div>
                      {developerTheme === theme.id && (
                        <div className="text-purple-600 text-xs font-medium">✓ Active</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Accent Color Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Accent Color</h3>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(accentColors) as AccentColor[]).map(color => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={`relative w-16 h-16 rounded-lg transition-all ${
                      accentColor === color ? 'ring-4 ring-offset-2 ring-blue-500' : ''
                    }`}
                    style={{ backgroundColor: accentColors[color] }}
                    title={color.charAt(0).toUpperCase() + color.slice(1)}
                  >
                    {accentColor === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-2xl drop-shadow-lg">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Accent color affects buttons, links, and interactive elements throughout the system
              </p>
            </div>

            {/* Theme Presets */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Presets</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {themePresets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setThemeMode(preset.mode)
                      setAccentColor(preset.accentColor)
                      if (preset.developerTheme) {
                        setDeveloperTheme(preset.developerTheme)
                      }
                    }}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all text-left group"
                  >
                    <div className="font-medium text-gray-900 mb-1 text-sm">{preset.name}</div>
                    <div className="text-xs text-gray-600">{preset.description}</div>
                    <div className="mt-3 flex space-x-1">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: preset.colors.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: preset.colors.background }}
                      />
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: preset.colors.windowChrome }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>💡 Tip:</strong> Your theme preference is saved in cookies and will be
                remembered on your next visit. The theme applies system-wide to all windows, the
                Dock, MenuBar, and UI elements.
              </p>
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
