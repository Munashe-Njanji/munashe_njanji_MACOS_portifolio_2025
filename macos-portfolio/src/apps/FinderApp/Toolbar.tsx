import React from 'react'

interface ToolbarProps {
  onCreateFile: (type: 'file' | 'folder') => void
  onCreateFolder: () => void
}

export const Toolbar: React.FC<ToolbarProps> = ({ onCreateFile, onCreateFolder }) => {
  return (
    <div className="h-12 px-4 flex items-center space-x-2 border-b theme-sidebar" style={{ borderColor: 'var(--theme-windowBorder)' }}>
      <button
        onClick={onCreateFolder}
        className="
          theme-button
          px-3 py-1.5 text-sm font-medium
          border rounded
          transition-colors
        "
        style={{ borderColor: 'var(--theme-windowBorder)' }}
        title="New Folder"
      >
        📁 New Folder
      </button>

      <button
        onClick={() => onCreateFile('file')}
        className="
          theme-button
          px-3 py-1.5 text-sm font-medium
          border rounded
          transition-colors
        "
        style={{ borderColor: 'var(--theme-windowBorder)' }}
        title="New File"
      >
        📄 New File
      </button>

      <div className="flex-1" />

      {/* View Options */}
      <div className="flex items-center space-x-1">
        <button
          className="
            theme-hover theme-text-secondary
            p-1.5 rounded
            transition-colors
          "
          title="List View"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
          </svg>
        </button>

        <button
          className="
            theme-hover theme-text-secondary
            p-1.5 rounded
            transition-colors
          "
          title="Grid View"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
