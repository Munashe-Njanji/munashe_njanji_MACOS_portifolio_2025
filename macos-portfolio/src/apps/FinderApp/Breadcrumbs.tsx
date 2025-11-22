import React from 'react'

interface BreadcrumbsProps {
  path: Array<{ id: string | null; name: string }>
  onNavigate: (folderId: string | null) => void
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onNavigate }) => {
  return (
    <div className="h-10 px-4 flex items-center space-x-2 border-b border-gray-200 bg-white text-sm">
      {path.map((item, index) => (
        <React.Fragment key={item.id || 'root'}>
          {index > 0 && <span className="text-gray-400">›</span>}
          <button
            onClick={() => onNavigate(item.id)}
            className={`
              px-2 py-1 rounded transition-colors
              ${
                index === path.length - 1
                  ? 'text-gray-900 font-medium'
                  : 'text-blue-600 hover:bg-blue-50'
              }
            `}
          >
            {item.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  )
}
