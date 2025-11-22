import type { Notification } from '@/types'

// Notification event system for triggering notifications based on system events
export class NotificationEventSystem {
  private pushNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void

  constructor(pushNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void) {
    this.pushNotification = pushNotification
  }

  // File system event notifications
  onFileCreated(fileName: string, fileType: 'file' | 'folder') {
    this.pushNotification({
      title: `${fileType === 'folder' ? 'Folder' : 'File'} Created`,
      body: `"${fileName}" has been created`,
      type: 'success',
      ttl: 3000,
    })
  }

  onFileDeleted(fileName: string, fileType: 'file' | 'folder') {
    this.pushNotification({
      title: `${fileType === 'folder' ? 'Folder' : 'File'} Deleted`,
      body: `"${fileName}" has been moved to trash`,
      type: 'info',
      ttl: 3000,
    })
  }

  onFileRenamed(oldName: string, newName: string) {
    this.pushNotification({
      title: 'File Renamed',
      body: `"${oldName}" renamed to "${newName}"`,
      type: 'info',
      ttl: 3000,
    })
  }

  onFileMoved(fileName: string, destination: string) {
    this.pushNotification({
      title: 'File Moved',
      body: `"${fileName}" moved to "${destination}"`,
      type: 'info',
      ttl: 3000,
    })
  }

  onFileError(fileName: string, error: string) {
    this.pushNotification({
      title: 'File Operation Failed',
      body: `Error with "${fileName}": ${error}`,
      type: 'error',
      ttl: 5000,
    })
  }

  // App event notifications
  onAppLaunched(appName: string) {
    this.pushNotification({
      title: 'Application Launched',
      body: `${appName} is now running`,
      type: 'info',
      ttl: 2000,
    })
  }

  onAppClosed(appName: string) {
    this.pushNotification({
      title: 'Application Closed',
      body: `${appName} has been closed`,
      type: 'info',
      ttl: 2000,
    })
  }

  onAppError(appName: string, error: string) {
    this.pushNotification({
      title: `${appName} Error`,
      body: error,
      type: 'error',
      ttl: 5000,
    })
  }

  // Window event notifications
  onWindowMaximized(appName: string) {
    this.pushNotification({
      title: 'Window Maximized',
      body: `${appName} window is now fullscreen`,
      type: 'info',
      ttl: 2000,
    })
  }

  onWindowMinimized(appName: string) {
    this.pushNotification({
      title: 'Window Minimized',
      body: `${appName} minimized to Dock`,
      type: 'info',
      ttl: 2000,
    })
  }

  // Space event notifications
  onSpaceCreated(spaceName: string) {
    this.pushNotification({
      title: 'Desktop Created',
      body: `New desktop "${spaceName}" created`,
      type: 'success',
      ttl: 3000,
    })
  }

  onSpaceDeleted(spaceName: string) {
    this.pushNotification({
      title: 'Desktop Deleted',
      body: `Desktop "${spaceName}" has been removed`,
      type: 'info',
      ttl: 3000,
    })
  }

  onSpaceSwitched(spaceName: string) {
    this.pushNotification({
      title: 'Desktop Switched',
      body: `Now viewing "${spaceName}"`,
      type: 'info',
      ttl: 2000,
    })
  }

  // Download event notifications
  onDownloadStarted(fileName: string) {
    this.pushNotification({
      title: 'Download Started',
      body: `Downloading "${fileName}"...`,
      type: 'info',
      ttl: 3000,
    })
  }

  onDownloadCompleted(fileName: string) {
    this.pushNotification({
      title: 'Download Complete',
      body: `"${fileName}" has been downloaded`,
      type: 'success',
      ttl: 4000,
      actionable: {
        label: 'Show in Finder',
        action: () => {
          // Will be implemented when Finder is ready
          console.log('Show in Finder:', fileName)
        },
      },
    })
  }

  onDownloadFailed(fileName: string, error: string) {
    this.pushNotification({
      title: 'Download Failed',
      body: `Failed to download "${fileName}": ${error}`,
      type: 'error',
      ttl: 5000,
    })
  }

  // System event notifications
  onLowStorage(availableSpace: string) {
    this.pushNotification({
      title: 'Low Storage Space',
      body: `Only ${availableSpace} remaining`,
      type: 'warning',
      ttl: 10000,
      actionable: {
        label: 'Manage Storage',
        action: () => {
          console.log('Open storage management')
        },
      },
    })
  }

  onStorageQuotaExceeded() {
    this.pushNotification({
      title: 'Storage Quota Exceeded',
      body: 'Unable to save files. Please free up space.',
      type: 'error',
      ttl: 10000,
      actionable: {
        label: 'Manage Storage',
        action: () => {
          console.log('Open storage management')
        },
      },
    })
  }

  onNetworkError() {
    this.pushNotification({
      title: 'Network Error',
      body: 'Unable to connect to the internet',
      type: 'error',
      ttl: 5000,
    })
  }

  // Custom notification
  custom(
    title: string,
    body: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    ttl: number = 5000,
    actionable?: { label: string; action: () => void }
  ) {
    this.pushNotification({
      title,
      body,
      type,
      ttl,
      actionable,
    })
  }
}

// Create a singleton instance that can be imported
let notificationEventSystem: NotificationEventSystem | null = null

export const initializeNotificationEventSystem = (
  pushNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
) => {
  notificationEventSystem = new NotificationEventSystem(pushNotification)
  return notificationEventSystem
}

export const getNotificationEventSystem = (): NotificationEventSystem => {
  if (!notificationEventSystem) {
    throw new Error(
      'NotificationEventSystem not initialized. Call initializeNotificationEventSystem first.'
    )
  }
  return notificationEventSystem
}
