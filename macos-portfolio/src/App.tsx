import { useCallback, useMemo, useEffect, useState } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Desktop } from '@/components/Desktop'
import { MenuBar } from '@/components/MenuBar'
import { Dock } from '@/components/Dock'
import { WindowManager } from '@/components/WindowManager'
import { Spotlight } from '@/components/Spotlight'
import { ContextMenu } from '@/components/ContextMenu'
import { NotificationCenter } from '@/components/NotificationCenter'
import { MissionControl } from '@/components/MissionControl'
import { WindowSwitcher } from '@/components/WindowSwitcher'
import { ClipboardManager } from '@/components/ClipboardManager'
import { LockScreen } from '@/components/LockScreen'
import {
  useWindowStore,
  useUIStore,
  usePreferencesStore,
  useSpacesStore,
  useNotificationStore,
  useFileStore,
} from '@/store'
import { initializeNotificationEventSystem } from '@/utils/notificationEvents'
import type { DockApp } from '@/types/components'

function App() {
  // Lock screen state
  const [isLocked, setIsLocked] = useState(true)

  // Store hooks
  const { windows, openWindow, focusWindow } = useWindowStore()
  
  // Window switcher state
  const [windowSwitcherVisible, setWindowSwitcherVisible] = useState(false)
  const [windowSwitcherIndex, setWindowSwitcherIndex] = useState(0)
  const [windowSwitcherWindows, setWindowSwitcherWindows] = useState<typeof windows>([])
  const {
    spotlightOpen,
    notificationCenterOpen,
    toggleSpotlight,
    toggleNotificationCenter,
    contextMenu,
    hideContextMenu,
  } = useUIStore()
  const { wallpaper, dockPosition } = usePreferencesStore()
  const { spaces, activeSpaceId, createSpace, switchSpace, moveWindowToSpace } = useSpacesStore()
  const {
    notifications,
    doNotDisturb,
    toggleDoNotDisturb,
    dismissNotification,
    clearAll,
    pushNotification,
  } = useNotificationStore()
  const { missionControlActive, activateMissionControl, deactivateMissionControl } = useUIStore()

  // Initialize notification event system
  useEffect(() => {
    initializeNotificationEventSystem(pushNotification)
  }, [pushNotification])

  // Initialize file system and open about-me.md on first load
  const { createFile, updateFileContent, files } = useFileStore()
  
  useEffect(() => {
    // Only run once on mount
    const initializeFiles = async () => {
      // Check if about-me.md already exists
      const aboutMeExists = Object.values(files).some(f => f.name === 'about-me.md')
      
      if (!aboutMeExists) {
        // Create the about-me.md file
        const fileId = createFile(null, 'about-me.md', 'file')
        
        // Fetch and set the content
        try {
          const response = await fetch('/about-me.md')
          const content = await response.text()
          updateFileContent(fileId, content)
          
          // Open the file in text editor after a short delay to ensure file is created
          setTimeout(() => {
            openWindow('text', { fileId })
          }, 500)
        } catch (error) {
          console.error('Failed to load about-me.md:', error)
          // Create with default content if fetch fails
          const defaultContent = `# About Me\n\nWelcome to my portfolio!\n\nThis is Munashe Njanji's interactive macOS-style portfolio.`
          updateFileContent(fileId, defaultContent)
          setTimeout(() => {
            openWindow('text', { fileId })
          }, 500)
        }
      }
    }

    initializeFiles()
  }, []) // Empty dependency array to run only once



  // Keyboard shortcuts for Mission Control, space switching, and window switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F3 for Mission Control
      if (e.key === 'F3') {
        e.preventDefault()
        if (missionControlActive) {
          deactivateMissionControl()
        } else {
          activateMissionControl()
        }
      }

      // Ctrl+Arrow keys for space switching
      if (e.ctrlKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault()
        const spaceIds = Object.keys(spaces)
        const currentIndex = spaceIds.indexOf(activeSpaceId)

        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          switchSpace(spaceIds[currentIndex - 1])
        } else if (e.key === 'ArrowRight' && currentIndex < spaceIds.length - 1) {
          switchSpace(spaceIds[currentIndex + 1])
        }
      }

      // Alt+Tab for window switching (or Cmd+Tab on Mac)
      if ((e.altKey || e.metaKey) && e.key === 'Tab' && !windowSwitcherVisible) {
        e.preventDefault()
        
        // Get visible windows in current space
        const visibleWindows = windows.filter(
          w => w.spaceId === activeSpaceId && !w.state.minimized
        )

        if (visibleWindows.length === 0) return

        // Sort by z-index to get proper order
        const sortedWindows = [...visibleWindows].sort((a, b) => b.zIndex - a.zIndex)
        
        // Show window switcher
        setWindowSwitcherWindows(sortedWindows)
        setWindowSwitcherIndex(sortedWindows.length > 1 ? 1 : 0)
        setWindowSwitcherVisible(true)
      }

      // Tab while window switcher is visible
      if (windowSwitcherVisible && e.key === 'Tab') {
        e.preventDefault()
        
        if (e.shiftKey) {
          // Shift+Tab goes backwards
          setWindowSwitcherIndex(prev => 
            prev <= 0 ? windowSwitcherWindows.length - 1 : prev - 1
          )
        } else {
          // Tab goes forward
          setWindowSwitcherIndex(prev => 
            prev >= windowSwitcherWindows.length - 1 ? 0 : prev + 1
          )
        }
      }

      // Cmd+Space for Spotlight (Mac standard)
      if (e.metaKey && e.key === ' ') {
        e.preventDefault()
        toggleSpotlight()
      }

      // Cmd+W to close focused window
      if (e.metaKey && e.key === 'w') {
        e.preventDefault()
        const focusedWindow = windows.find(w => w.state.focused)
        if (focusedWindow) {
          useWindowStore.getState().closeWindow(focusedWindow.id)
        }
      }

      // Cmd+M to minimize focused window
      if (e.metaKey && e.key === 'm') {
        e.preventDefault()
        const focusedWindow = windows.find(w => w.state.focused)
        if (focusedWindow) {
          useWindowStore.getState().minimizeWindow(focusedWindow.id)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      // When Alt/Cmd is released, switch to selected window
      if ((e.key === 'Alt' || e.key === 'Meta') && windowSwitcherVisible) {
        const selectedWindow = windowSwitcherWindows[windowSwitcherIndex]
        if (selectedWindow) {
          focusWindow(selectedWindow.id)
        }
        setWindowSwitcherVisible(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [
    missionControlActive,
    activateMissionControl,
    deactivateMissionControl,
    spaces,
    activeSpaceId,
    switchSpace,
    windows,
    focusWindow,
    toggleSpotlight,
    windowSwitcherVisible,
    windowSwitcherWindows,
    windowSwitcherIndex,
  ])

  // Dock apps configuration
  const dockApps: DockApp[] = useMemo(
    () => [
      {
        id: 'finder',
        appType: 'finder',
        icon: '/img/icons/launchpad.png',
        label: 'Finder',
        keepInDock: true,
      },
      {
        id: 'safari',
        appType: 'safari',
        icon: '/img/icons/safari.png',
        label: 'Safari',
        keepInDock: true,
      },
      {
        id: 'text',
        appType: 'text',
        icon: '/img/icons/typora.png',
        label: 'Text Editor',
        keepInDock: true,
      },
      {
        id: 'terminal',
        appType: 'terminal',
        icon: '/img/icons/terminal.png',
        label: 'Terminal',
        keepInDock: true,
      },
      {
        id: 'image-viewer',
        appType: 'image',
        icon: '/img/icons/preview.png',
        label: 'Preview',
        keepInDock: true,
      },
      {
        id: 'clipboard',
        appType: 'clipboard',
        icon: 'clipboard',
        label: 'Clipboard Manager',
        keepInDock: true,
      },
      {
        id: 'preferences',
        appType: 'preferences',
        icon: 'settings',
        label: 'System Preferences',
        keepInDock: true,
      },
      {
        id: 'github',
        appType: 'github',
        icon: '/img/icons/github.png',
        label: 'GitHub',
        keepInDock: true,
      },
      {
        id: 'vscode',
        appType: 'vscode',
        icon: '/img/icons/vscode.png',
        label: 'VS Code',
        keepInDock: true,
      },
    ],
    []
  )

  // Get active app IDs for dock indicators
  const activeAppIds = useMemo(() => {
    return windows.map(w => w.appType)
  }, [windows])

  // Handlers
  const handleSpotlightClick = useCallback(() => {
    toggleSpotlight()
  }, [toggleSpotlight])

  const handleNotificationCenterClick = useCallback(() => {
    toggleNotificationCenter()
  }, [toggleNotificationCenter])

  const handleDockLaunch = useCallback(
    (appType: string) => {
      // Check if there's already a window of this type
      const existingWindow = windows.find(w => w.appType === appType)
      if (existingWindow) {
        // If window is minimized, restore it first
        if (existingWindow.state.minimized) {
          useWindowStore.getState().minimizeWindow(existingWindow.id) // Toggle minimize
        }
        // Focus existing window
        focusWindow(existingWindow.id)
      } else {
        // Open new window
        openWindow(appType as any)
      }
    },
    [windows, openWindow, focusWindow]
  )

  const handleDockFocus = useCallback(
    (appType: string) => {
      const window = windows.find(w => w.appType === appType)
      if (window) {
        focusWindow(window.id)
      }
    },
    [windows, focusWindow]
  )

  const handleSpotlightClose = useCallback(() => {
    toggleSpotlight()
  }, [toggleSpotlight])

  // Handle unlock
  const handleUnlock = useCallback(() => {
    setIsLocked(false)
  }, [])

  // Show lock screen if locked
  if (isLocked) {
    return <LockScreen onUnlock={handleUnlock} />
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* MenuBar */}
      <MenuBar
        onSpotlightClick={handleSpotlightClick}
        onNotificationCenterClick={handleNotificationCenterClick}
      />

      {/* Desktop */}
      <Desktop wallpaper={wallpaper}>
        {/* Window Manager */}
        <WindowManager windows={windows} activeSpaceId={activeSpaceId} />
      </Desktop>

      {/* Dock */}
      <Dock
        apps={dockApps}
        activeAppIds={activeAppIds}
        onLaunch={handleDockLaunch}
        onFocus={handleDockFocus}
        position={dockPosition}
      />

      {/* Spotlight Search */}
      <Spotlight isOpen={spotlightOpen} onClose={handleSpotlightClose} />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={toggleNotificationCenter}
        notifications={notifications}
        doNotDisturb={doNotDisturb}
        onToggleDoNotDisturb={toggleDoNotDisturb}
        onDismiss={dismissNotification}
        onClearAll={clearAll}
      />

      {/* Mission Control */}
      <MissionControl
        isActive={missionControlActive}
        onClose={deactivateMissionControl}
        windows={windows}
        spaces={Object.values(spaces).map(space => ({
          id: space.id,
          name: space.name,
          windowIds: space.windowIds,
        }))}
        activeSpaceId={activeSpaceId}
        onCreateSpace={createSpace}
        onSwitchSpace={switchSpace}
        onMoveWindow={moveWindowToSpace}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={hideContextMenu}
        />
      )}

      {/* Window Switcher (Alt+Tab) */}
      <WindowSwitcher
        isVisible={windowSwitcherVisible}
        windows={windowSwitcherWindows}
        selectedIndex={windowSwitcherIndex}
      />

      {/* Clipboard Manager */}
      <ClipboardManager />

      {/* Vercel Speed Insights for performance monitoring */}
      <SpeedInsights />
    </div>
  )
}

export default App
