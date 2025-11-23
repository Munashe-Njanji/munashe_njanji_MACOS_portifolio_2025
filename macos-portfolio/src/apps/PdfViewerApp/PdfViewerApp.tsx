import React, { useState, lazy, Suspense } from 'react'
import type { PdfViewerAppProps } from '@/types/components'
import { useFileStore } from '@/store'

// Lazy load react-pdf to reduce initial bundle size
const Document = lazy(() =>
  import('react-pdf').then(module => ({ default: module.Document }))
)
const Page = lazy(() => import('react-pdf').then(module => ({ default: module.Page })))

// Import worker
import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export const PdfViewerApp: React.FC<PdfViewerAppProps> = ({ appInstance }) => {
  const { fileContents } = useFileStore()
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fileId = appInstance.props?.fileId
  const fileContent = fileId ? fileContents[fileId] : null

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }

  const onDocumentLoadError = (error: Error) => {
    setError(error.message)
    setLoading(false)
  }

  if (!fileContent) {
    return (
      <div className="theme-app-bg w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📕</div>
          <p className="theme-text-secondary">No PDF file loaded</p>
        </div>
      </div>
    )
  }

  return (
    <div className="theme-app-bg w-full h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-12 px-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--theme-windowBorder)', background: 'var(--theme-foreground)' }}>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="theme-button px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            ← Previous
          </button>
          <span className="theme-text-primary text-sm">
            Page {pageNumber} of {numPages || '?'}
          </span>
          <button
            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
            className="theme-button px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            Next →
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded">
            Download
          </button>
          <button className="theme-button px-3 py-1 text-sm rounded">
            Print
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {loading && (
          <div className="text-center">
            <div className="text-4xl mb-2">⏳</div>
            <p className="theme-text-secondary">Loading PDF...</p>
          </div>
        )}

        {error && (
          <div className="text-center">
            <div className="text-4xl mb-2">❌</div>
            <p className="text-red-600">Error loading PDF</p>
            <p className="theme-text-tertiary text-sm mt-2">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <Suspense
            fallback={
              <div className="text-center">
                <div className="text-4xl mb-2">⏳</div>
                <p className="theme-text-secondary">Loading PDF viewer...</p>
              </div>
            }
          >
            <Document
              file={fileContent.content}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="text-center">
                  <div className="text-4xl mb-2">⏳</div>
                  <p className="theme-text-secondary">Loading document...</p>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-lg"
              />
            </Document>
          </Suspense>
        )}
      </div>
    </div>
  )
}
