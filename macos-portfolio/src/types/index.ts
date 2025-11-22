// Core application types

export type AppType =
  | 'finder'
  | 'pdf'
  | 'safari'
  | 'text'
  | 'image'
  | 'terminal'
  | 'preferences'
  | 'clipboard'
  | 'github'
  | 'vscode'

export interface Position {
  x: number
  y: number
}

export interface Size {
  w: number
  h: number
}

export interface AppInstance {
  id: string
  appType: AppType
  zIndex: number
  position: Position
  size: Size
  state: {
    minimized?: boolean
    maximized?: boolean
    focused?: boolean
  }
  spaceId: string
  props?: Record<string, any>
}

// File system types
export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  mimeType?: string
  size?: number
  parentId: string | null
  createdAt: number
  updatedAt: number
  metadata: {
    tags?: string[]
    color?: string
    icon?: string
  }
}

export interface FileContent {
  fileId: string
  content: Blob | string
}

// Store slice interfaces
export interface WindowStore {
  windows: AppInstance[]
  focusedWindowId: string | null

  // Actions
  openWindow: (appType: AppType, props?: any) => string
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  updateWindowPosition: (id: string, position: Position) => void
  updateWindowSize: (id: string, size: Size) => void
  bringToFront: (id: string) => void
}

export interface FileStore {
  files: Record<string, FileNode>
  fileContents: Record<string, FileContent>

  // Actions
  createFile: (parentId: string | null, name: string, type: 'file' | 'folder') => string
  readFile: (id: string) => Promise<FileContent>
  updateFile: (id: string, updates: Partial<FileNode>) => void
  updateFileContent: (id: string, content: Blob | string) => void
  deleteFile: (id: string) => void
  moveFile: (id: string, newParentId: string) => void
  renameFile: (id: string, newName: string) => void
  getFileTree: (parentId?: string) => FileNode[]
}

export interface MenuItem {
  id: string
  label: string
  icon?: string
  action: () => void
  disabled?: boolean
  separator?: boolean
}

export interface UIStore {
  spotlightOpen: boolean
  notificationCenterOpen: boolean
  missionControlActive: boolean
  contextMenu: { x: number; y: number; items: MenuItem[] } | null

  // Actions
  toggleSpotlight: () => void
  toggleNotificationCenter: () => void
  activateMissionControl: () => void
  deactivateMissionControl: () => void
  showContextMenu: (x: number, y: number, items: MenuItem[]) => void
  hideContextMenu: () => void
}

export interface PreferencesStore {
  theme: 'light' | 'dark' | 'auto'
  wallpaper: string
  dockPosition: 'bottom' | 'left' | 'right'
  dockSize: number
  dockMagnification: number
  snapToGrid: boolean
  gridSize: number
  animationScale: number
  reduceMotion: boolean

  // Actions
  updatePreference: <K extends keyof Omit<PreferencesStore, 'updatePreference'>>(
    key: K,
    value: PreferencesStore[K]
  ) => void
}

export interface Space {
  id: string
  name: string
  windowIds: string[]
}

export interface SpacesStore {
  spaces: Record<string, Space>
  activeSpaceId: string

  // Actions
  createSpace: () => string
  deleteSpace: (id: string) => void
  switchSpace: (id: string) => void
  moveWindowToSpace: (windowId: string, spaceId: string) => void
}

export interface Notification {
  id: string
  title: string
  body: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: number
  ttl: number
  actionable?: {
    label: string
    action: () => void
  }
}

export interface NotificationStore {
  notifications: Notification[]
  doNotDisturb: boolean

  // Actions
  pushNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  dismissNotification: (id: string) => void
  clearAll: () => void
  toggleDoNotDisturb: () => void
}

export interface SearchResult {
  id: string
  type: 'file' | 'app' | 'bookmark' | 'command' | 'setting'
  title: string
  subtitle?: string
  icon: string
  score: number
  action: () => void
}

export interface SearchIndex {
  files: Map<string, FileNode>
  apps: Map<string, { name: string; type: AppType }>
  bookmarks: Map<string, { title: string; url: string }>
  commands: Map<string, { name: string; description?: string; action: () => void }>
  settings: Map<string, { id: string; name: string; path?: string }>
}

export interface SpotlightStore {
  index: SearchIndex
  recentSearches: string[]
  query: string
  results: SearchResult[]

  // Actions
  setQuery: (query: string) => void
  search: (query: string) => void
  rebuildIndex: (files?: Map<string, any>) => void
  addToRecent: (query: string) => void
  addFileToIndex: (fileId: string, file: any) => void
  removeFileFromIndex: (fileId: string) => void
  addBookmarkToIndex: (bookmarkId: string, bookmark: any) => void
  removeBookmarkFromIndex: (bookmarkId: string) => void
}

export interface TerminalOutput {
  type: 'command' | 'output' | 'error'
  content: string
  timestamp: number
}

export interface TerminalSession {
  id: string
  cwd: string
  history: string[]
  historyIndex: number
  output: TerminalOutput[]
}

export interface TerminalStore {
  sessions: Record<string, TerminalSession>

  // Actions
  createSession: (windowId: string) => void
  executeCommand: (sessionId: string, command: string) => void
  addToHistory: (sessionId: string, command: string) => void
  clearSession: (sessionId: string) => void
}

// HOC prop injection types
export interface DraggableInjectedProps {
  onDragStart?: (e: React.MouseEvent | React.TouchEvent) => void
  onDrag?: (e: React.MouseEvent | React.TouchEvent) => void
  onDragEnd?: (e: React.MouseEvent | React.TouchEvent) => void
  position: Position
  isDragging: boolean
}

export interface ResizableInjectedProps {
  onResizeStart?: (e: React.MouseEvent | React.TouchEvent) => void
  onResize?: (e: React.MouseEvent | React.TouchEvent) => void
  onResizeEnd?: (e: React.MouseEvent | React.TouchEvent) => void
  size: Size
  isResizing: boolean
}

export interface GSAPInjectedProps {
  animationRef: React.RefObject<HTMLElement>
}

export interface PersistedStateInjectedProps<T> {
  persistedState: T
  updatePersistedState: (updates: Partial<T>) => void
}

export interface WindowControlsInjectedProps {
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onFocus: () => void
  isFocused: boolean
  isMinimized: boolean
  isMaximized: boolean
}

// HOC options types
export interface DraggableOptions {
  handle?: string
  bounds?: 'parent' | { left: number; top: number; right: number; bottom: number }
  grid?: [number, number]
  disabled?: boolean
}

export interface ResizableOptions {
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  handles?: ('n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw')[]
  disabled?: boolean
}

export interface GSAPOptions {
  createTimeline: (ref: React.RefObject<HTMLElement>, props: any) => gsap.core.Timeline
}

export interface PersistedStateOptions {
  key: string
  defaultValue?: any
}
