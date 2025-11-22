import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { FileNode, FileContent } from '@/types'

// Database schema
interface DFinderDB extends DBSchema {
  files: {
    key: string
    value: FileNode
    indexes: { 'by-parent': string }
  }
  fileContents: {
    key: string
    value: FileContent
  }
  metadata: {
    key: string
    value: any
  }
}

const DB_NAME = 'macos-portfolio-dfinder'
const DB_VERSION = 1

class DFinderAdapter {
  private db: IDBPDatabase<DFinderDB> | null = null
  private initPromise: Promise<void> | null = null

  async init(): Promise<void> {
    if (this.db) return
    if (this.initPromise) return this.initPromise

    this.initPromise = (async () => {
      try {
        this.db = await openDB<DFinderDB>(DB_NAME, DB_VERSION, {
          upgrade(db) {
            // Create files store
            if (!db.objectStoreNames.contains('files')) {
              const filesStore = db.createObjectStore('files', { keyPath: 'id' })
              filesStore.createIndex('by-parent', 'parentId')
            }

            // Create file contents store
            if (!db.objectStoreNames.contains('fileContents')) {
              db.createObjectStore('fileContents', { keyPath: 'fileId' })
            }

            // Create metadata store
            if (!db.objectStoreNames.contains('metadata')) {
              db.createObjectStore('metadata')
            }
          },
        })
      } catch (error) {
        console.error('Failed to initialize IndexedDB:', error)
        throw error
      }
    })()

    return this.initPromise
  }

  async saveFile(file: FileNode): Promise<void> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')
    await this.db.put('files', file)
  }

  async getFile(id: string): Promise<FileNode | undefined> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')
    return await this.db.get('files', id)
  }

  async getAllFiles(): Promise<FileNode[]> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')
    return await this.db.getAll('files')
  }

  async deleteFile(id: string): Promise<void> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')
    await this.db.delete('files', id)
    await this.db.delete('fileContents', id)
  }

  async saveFileContent(content: FileContent): Promise<void> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')
    await this.db.put('fileContents', content)
  }

  async getFileContent(fileId: string): Promise<FileContent | undefined> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')
    return await this.db.get('fileContents', fileId)
  }

  async clearAll(): Promise<void> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')
    const tx = this.db.transaction(['files', 'fileContents', 'metadata'], 'readwrite')
    await Promise.all([
      tx.objectStore('files').clear(),
      tx.objectStore('fileContents').clear(),
      tx.objectStore('metadata').clear(),
      tx.done,
    ])
  }

  async exportData(): Promise<{
    files: FileNode[]
    fileContents: FileContent[]
    metadata: Record<string, any>
  }> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')

    const files = await this.getAllFiles()
    const fileContents = await this.db.getAll('fileContents')
    const metadataKeys = await this.db.getAllKeys('metadata')
    const metadata: Record<string, any> = {}

    for (const key of metadataKeys) {
      metadata[key as string] = await this.db.get('metadata', key)
    }

    return { files, fileContents, metadata }
  }

  async importData(data: {
    files: FileNode[]
    fileContents: FileContent[]
    metadata: Record<string, any>
  }): Promise<void> {
    await this.init()
    if (!this.db) throw new Error('Database not initialized')

    await this.clearAll()

    const filesTx = this.db.transaction('files', 'readwrite')
    await Promise.all([...data.files.map(file => filesTx.store.put(file)), filesTx.done])

    const contentsTx = this.db.transaction('fileContents', 'readwrite')
    await Promise.all([
      ...data.fileContents.map(content => contentsTx.store.put(content)),
      contentsTx.done,
    ])

    const metadataTx = this.db.transaction('metadata', 'readwrite')
    await Promise.all([
      ...Object.entries(data.metadata).map(([key, value]) => metadataTx.store.put(value, key)),
      metadataTx.done,
    ])
  }
}

export const dfinderAdapter = new DFinderAdapter()
