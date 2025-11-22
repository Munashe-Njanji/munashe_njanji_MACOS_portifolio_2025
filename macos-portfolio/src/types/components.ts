import type { AppInstance, AppType, FileNode, MenuItem, Notification, SearchResult } from './index'

// Desktop component
export interface DesktopProps {
  wallpaper: string
  children?: React.ReactNode
}

// MenuBar component
export interface MenuBarProps {
  onSpotlightClick: () => void
  onNotificationCenterClick: () => void
}

// Dock component
export interface DockApp {
  id: string
  appType: AppType
  icon: string
  label: string
  keepInDock: boolean
}

export interface DockProps {
  apps: DockApp[]
  activeAppIds: string[]
  onLaunch: (appType: AppType) => void
  onFocus: (appId: string) => void
  position?: 'bottom' | 'left' | 'right'
  size?: number
  magnification?: number
}

export interface DockIconProps {
  app: DockApp
  isActive: boolean
  onClick: () => void
  onContextMenu: (e: React.MouseEvent) => void
}

// WindowFrame component
export interface WindowFrameProps {
  appInstance: AppInstance
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onFocus: () => void
  children: React.ReactNode
  title?: string
}

export interface TitleBarProps {
  title: string
  isFocused: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
}

export interface TrafficLightsProps {
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  isFocused: boolean
}

// WindowManager component
export interface WindowManagerProps {
  windows: AppInstance[]
  activeSpaceId: string
}

// ContextMenu component
export interface ContextMenuProps {
  x: number
  y: number
  items: MenuItem[]
  onClose: () => void
}

// Icon component
export interface IconProps {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  onClick?: () => void
  onDoubleClick?: () => void
  onContextMenu?: (e: React.MouseEvent) => void
}

// Spotlight components
export interface SpotlightProps {
  isOpen: boolean
  onClose: () => void
}

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  autoFocus?: boolean
}

export interface SearchResultsProps {
  results: SearchResult[]
  selectedIndex: number
  onSelect: (result: SearchResult) => void
  onHover: (index: number) => void
}

export interface SearchResultItemProps {
  result: SearchResult
  isSelected: boolean
  onClick: () => void
  onHover: () => void
}

// Notification Center components
export interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  doNotDisturb: boolean
  onToggleDoNotDisturb: () => void
  onDismiss: (id: string) => void
  onClearAll: () => void
}

export interface NotificationToastProps {
  notification: Notification
  onDismiss: () => void
  onClick?: () => void
}

// Mission Control components
export interface MissionControlProps {
  isActive: boolean
  onClose: () => void
  windows: AppInstance[]
  spaces: Array<{ id: string; name: string; windowIds: string[] }>
  activeSpaceId: string
  onCreateSpace: () => void
  onSwitchSpace: (spaceId: string) => void
  onMoveWindow: (windowId: string, spaceId: string) => void
}

export interface SpaceThumbnailProps {
  space: { id: string; name: string; windowIds: string[] }
  isActive: boolean
  onClick: () => void
  onAddSpace?: () => void
}

export interface WindowGridProps {
  windows: AppInstance[]
  onWindowClick: (windowId: string) => void
  onWindowDrag: (windowId: string, spaceId: string) => void
}

// Application component interfaces
export interface AppComponentProps {
  appInstance: AppInstance
  onUpdate: (updates: Partial<AppInstance>) => void
}

// FinderApp
export interface FinderAppProps {
  appInstance: AppInstance
}

export interface FileTreeProps {
  files: FileNode[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDoubleClick: (file: FileNode) => void
  onContextMenu: (file: FileNode, e: React.MouseEvent) => void
  onDragStart: (file: FileNode) => void
  onDrop: (targetId: string) => void
}

export interface FileItemProps {
  file: FileNode
  isSelected: boolean
  onClick: () => void
  onDoubleClick: () => void
  onContextMenu: (e: React.MouseEvent) => void
  draggable?: boolean
  onDragStart?: () => void
}

// PdfViewerApp
export interface PdfViewerAppProps extends AppComponentProps {
  fileId: string
  fileContent: Blob | string
}

export interface PdfControlsProps {
  currentPage: number
  totalPages: number
  zoom: number
  onNextPage: () => void
  onPrevPage: () => void
  onGoToPage: (page: number) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onFitToWindow: () => void
  onActualSize: () => void
  onDownload: () => void
  onPrint: () => void
}

// SafariApp
export interface SafariAppProps extends AppComponentProps {
  initialUrl?: string
}

export interface AddressBarProps {
  url: string
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
  onNavigate: (url: string) => void
  onBack: () => void
  onForward: () => void
  onReload: () => void
  onBookmark: () => void
}

export interface BookmarksProps {
  bookmarks: Array<{ id: string; title: string; url: string }>
  onSelect: (url: string) => void
  onDelete: (id: string) => void
}

// TextEditorApp
export interface TextEditorAppProps extends AppComponentProps {
  fileId: string
  fileContent: string
}

export interface EditorToolbarProps {
  canUndo: boolean
  canRedo: boolean
  isSaved: boolean
  onSave: () => void
  onUndo: () => void
  onRedo: () => void
}

// ImageViewerApp
export interface ImageViewerAppProps extends AppComponentProps {
  fileId: string
  fileContent: Blob | string
}

export interface ImageControlsProps {
  zoom: number
  rotation: number
  onZoomIn: () => void
  onZoomOut: () => void
  onRotate: () => void
  onFitToWindow: () => void
  onActualSize: () => void
}

// TerminalApp
export interface TerminalAppProps extends AppComponentProps {
  sessionId: string
}

export interface TerminalOutputProps {
  output: Array<{
    type: 'command' | 'output' | 'error'
    content: string
    timestamp: number
  }>
}

export interface TerminalInputProps {
  value: string
  prompt: string
  onChange: (value: string) => void
  onSubmit: () => void
  onHistoryUp: () => void
  onHistoryDown: () => void
  onTabComplete: () => void
}

// SystemPreferencesApp
export interface SystemPreferencesAppProps extends AppComponentProps {}

export interface PreferencesPanelProps {
  title: string
  children: React.ReactNode
}

export interface PreferencesSliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

export interface PreferencesToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export interface PreferencesSelectProps {
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}

// ClipboardManager
export interface ClipboardManagerProps {
  isOpen: boolean
  onClose: () => void
  entries: Array<{
    id: string
    content: string
    timestamp: number
  }>
  onSelect: (id: string) => void
}

export interface ClipboardEntryProps {
  entry: {
    id: string
    content: string
    timestamp: number
  }
  isSelected: boolean
  onClick: () => void
}
