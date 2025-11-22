import type { FileNode, FileContent } from '@/types'
import { dfinderAdapter } from './dfinderAdapter'

export interface FileSystemExport {
  version: number
  exportDate: string
  files: FileNode[]
  fileContents: Array<{
    fileId: string
    content: string // Base64 encoded for Blobs
    isBlob: boolean
  }>
}

// Convert Blob to Base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1] // Remove data:*/*;base64, prefix
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Convert Base64 to Blob
const base64ToBlob = (base64: string, mimeType: string = 'application/octet-stream'): Blob => {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

// Export file system to JSON
export const exportFileSystem = async (): Promise<string> => {
  try {
    const data = await dfinderAdapter.exportData()

    // Convert file contents to exportable format
    const exportableContents = await Promise.all(
      data.fileContents.map(async content => {
        if (content.content instanceof Blob) {
          const base64 = await blobToBase64(content.content)
          return {
            fileId: content.fileId,
            content: base64,
            isBlob: true,
          }
        } else {
          return {
            fileId: content.fileId,
            content: content.content,
            isBlob: false,
          }
        }
      })
    )

    const exportData: FileSystemExport = {
      version: 1,
      exportDate: new Date().toISOString(),
      files: data.files,
      fileContents: exportableContents,
    }

    return JSON.stringify(exportData, null, 2)
  } catch (error) {
    console.error('Failed to export file system:', error)
    throw new Error('Failed to export file system')
  }
}

// Import file system from JSON
export const importFileSystem = async (jsonString: string): Promise<void> => {
  try {
    const exportData: FileSystemExport = JSON.parse(jsonString)

    // Validate export data
    if (!exportData.version || !exportData.files || !exportData.fileContents) {
      throw new Error('Invalid export format')
    }

    // Convert file contents back to proper format
    const fileContents: FileContent[] = exportData.fileContents.map(content => {
      if (content.isBlob) {
        // Find the file to get its mime type
        const file = exportData.files.find(f => f.id === content.fileId)
        const mimeType = file?.mimeType || 'application/octet-stream'
        const blob = base64ToBlob(content.content, mimeType)

        return {
          fileId: content.fileId,
          content: blob,
        }
      } else {
        return {
          fileId: content.fileId,
          content: content.content,
        }
      }
    })

    // Import to IndexedDB
    await dfinderAdapter.importData({
      files: exportData.files,
      fileContents,
      metadata: {},
    })
  } catch (error) {
    console.error('Failed to import file system:', error)
    throw new Error('Failed to import file system: ' + (error as Error).message)
  }
}

// Download export as file
export const downloadFileSystemExport = async (
  filename: string = 'macos-portfolio-export.json'
) => {
  try {
    const jsonString = await exportFileSystem()
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to download export:', error)
    throw error
  }
}

// Upload and import file
export const uploadAndImportFileSystem = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'

    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) {
        reject(new Error('No file selected'))
        return
      }

      try {
        const text = await file.text()
        await importFileSystem(text)
        resolve()
      } catch (error) {
        reject(error)
      }
    }

    input.click()
  })
}

// Validate export data
export const validateExportData = (
  jsonString: string
): {
  valid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  try {
    const data = JSON.parse(jsonString)

    if (!data.version) {
      errors.push('Missing version field')
    }

    if (!data.exportDate) {
      errors.push('Missing exportDate field')
    }

    if (!Array.isArray(data.files)) {
      errors.push('Missing or invalid files array')
    }

    if (!Array.isArray(data.fileContents)) {
      errors.push('Missing or invalid fileContents array')
    }

    // Validate file structure
    if (Array.isArray(data.files)) {
      data.files.forEach((file: any, index: number) => {
        if (!file.id) errors.push(`File at index ${index} missing id`)
        if (!file.name) errors.push(`File at index ${index} missing name`)
        if (!file.type) errors.push(`File at index ${index} missing type`)
      })
    }

    // Validate file contents structure
    if (Array.isArray(data.fileContents)) {
      data.fileContents.forEach((content: any, index: number) => {
        if (!content.fileId) errors.push(`Content at index ${index} missing fileId`)
        if (content.content === undefined) errors.push(`Content at index ${index} missing content`)
        if (typeof content.isBlob !== 'boolean')
          errors.push(`Content at index ${index} missing isBlob flag`)
      })
    }
  } catch (error) {
    errors.push('Invalid JSON format')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Get export statistics
export const getExportStatistics = async (): Promise<{
  totalFiles: number
  totalFolders: number
  totalSize: number
  fileTypes: Record<string, number>
}> => {
  try {
    const data = await dfinderAdapter.exportData()

    const stats = {
      totalFiles: 0,
      totalFolders: 0,
      totalSize: 0,
      fileTypes: {} as Record<string, number>,
    }

    data.files.forEach(file => {
      if (file.type === 'folder') {
        stats.totalFolders++
      } else {
        stats.totalFiles++
        stats.totalSize += file.size || 0

        const ext = file.name.split('.').pop()?.toLowerCase() || 'unknown'
        stats.fileTypes[ext] = (stats.fileTypes[ext] || 0) + 1
      }
    })

    return stats
  } catch (error) {
    console.error('Failed to get export statistics:', error)
    throw error
  }
}
