// Persistence utilities for localStorage with migration support

export interface StorageSchema {
  version: number
  data: any
}

export class PersistenceManager {
  private storageKey: string
  private currentVersion: number
  private migrations: Map<number, (data: any) => any>

  constructor(storageKey: string, currentVersion: number = 1) {
    this.storageKey = storageKey
    this.currentVersion = currentVersion
    this.migrations = new Map()
  }

  // Register a migration function for a specific version
  addMigration(version: number, migrationFn: (data: any) => any): void {
    this.migrations.set(version, migrationFn)
  }

  // Save data to localStorage
  save(data: any): boolean {
    try {
      const schema: StorageSchema = {
        version: this.currentVersion,
        data,
      }
      localStorage.setItem(this.storageKey, JSON.stringify(schema))
      return true
    } catch (error) {
      console.error(`Failed to save to localStorage (${this.storageKey}):`, error)
      return false
    }
  }

  // Load data from localStorage with automatic migration
  load(): any | null {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return null

      const schema: StorageSchema = JSON.parse(stored)
      let data = schema.data

      // Apply migrations if needed
      if (schema.version < this.currentVersion) {
        data = this.migrate(data, schema.version, this.currentVersion)

        // Save migrated data
        this.save(data)
      }

      return data
    } catch (error) {
      console.error(`Failed to load from localStorage (${this.storageKey}):`, error)
      return null
    }
  }

  // Apply migrations from old version to new version
  private migrate(data: any, fromVersion: number, toVersion: number): any {
    let migratedData = data

    for (let v = fromVersion + 1; v <= toVersion; v++) {
      const migration = this.migrations.get(v)
      if (migration) {
        migratedData = migration(migratedData)
      }
    }

    return migratedData
  }

  // Clear data from localStorage
  clear(): void {
    localStorage.removeItem(this.storageKey)
  }

  // Check if data exists
  exists(): boolean {
    return localStorage.getItem(this.storageKey) !== null
  }
}

// Serialize/deserialize helpers for complex data types
export const serializeForStorage = (data: any): string => {
  return JSON.stringify(data, (_key, value) => {
    // Handle special types
    if (value instanceof Map) {
      return {
        __type: 'Map',
        value: Array.from(value.entries()),
      }
    }
    if (value instanceof Set) {
      return {
        __type: 'Set',
        value: Array.from(value),
      }
    }
    if (value instanceof Date) {
      return {
        __type: 'Date',
        value: value.toISOString(),
      }
    }
    return value
  })
}

export const deserializeFromStorage = (json: string): any => {
  return JSON.parse(json, (_key, value) => {
    // Restore special types
    if (value && typeof value === 'object' && '__type' in value) {
      switch (value.__type) {
        case 'Map':
          return new Map(value.value)
        case 'Set':
          return new Set(value.value)
        case 'Date':
          return new Date(value.value)
      }
    }
    return value
  })
}

// Session storage utilities (for temporary data that doesn't persist across browser sessions)
export class SessionManager {
  private storageKey: string

  constructor(storageKey: string) {
    this.storageKey = storageKey
  }

  save(data: any): boolean {
    try {
      sessionStorage.setItem(this.storageKey, JSON.stringify(data))
      return true
    } catch (error) {
      console.error(`Failed to save to sessionStorage (${this.storageKey}):`, error)
      return false
    }
  }

  load(): any | null {
    try {
      const stored = sessionStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error(`Failed to load from sessionStorage (${this.storageKey}):`, error)
      return null
    }
  }

  clear(): void {
    sessionStorage.removeItem(this.storageKey)
  }

  exists(): boolean {
    return sessionStorage.getItem(this.storageKey) !== null
  }
}

// Utility to check storage availability
export const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
  try {
    const storage = type === 'localStorage' ? window.localStorage : window.sessionStorage
    const test = '__storage_test__'
    storage.setItem(test, test)
    storage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

// Utility to get storage usage
export const getStorageUsage = (): {
  used: number
  available: number
  percentage: number
} => {
  let used = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length
    }
  }

  // Most browsers have a 5-10MB limit for localStorage
  const available = 5 * 1024 * 1024 // 5MB estimate
  const percentage = (used / available) * 100

  return { used, available, percentage }
}

// Create persistence managers for different stores
export const windowSessionManager = new SessionManager('macos-portfolio-window-session')
export const filesPersistence = new PersistenceManager('macos-portfolio-files', 1)
export const notificationsPersistence = new PersistenceManager('macos-portfolio-notifications', 1)

// Example migration for files (if schema changes in future)
filesPersistence.addMigration(2, (data: any) => {
  // Example: Add new field to all files
  if (data.files) {
    Object.values(data.files).forEach((file: any) => {
      if (!file.metadata) {
        file.metadata = {}
      }
    })
  }
  return data
})
