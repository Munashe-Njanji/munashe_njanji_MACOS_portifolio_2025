import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useFileStore, useUIStore } from '@/store'
import type { AppInstance, MenuItem } from '@/types'
import gsap from 'gsap'

interface ImageViewerAppProps {
  appInstance: AppInstance
}

export const ImageViewerApp: React.FC<ImageViewerAppProps> = ({ appInstance }) => {
  const { files, fileContents } = useFileStore()
  const { showContextMenu } = useUIStore()
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [fitToWindow, setFitToWindow] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)

  const fileId = appInstance.props?.fileId
  const file = fileId ? files[fileId] : null
  const fileContent = fileId ? fileContents[fileId] : null

  // Get image URL
  const getImageUrl = useCallback(() => {
    if (!fileContent) return null

    if (typeof fileContent.content === 'string') {
      // If it's a base64 string or URL
      return fileContent.content
    } else if (fileContent.content instanceof Blob) {
      // If it's a Blob, create object URL
      return URL.createObjectURL(fileContent.content)
    }

    return null
  }, [fileContent])

  const imageUrl = getImageUrl()

  // Handle image load
  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setImageLoaded(true)
    setImageError(false)
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
    setImageLoaded(false)
  }, [])

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 400))
    setFitToWindow(false)
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 25))
    setFitToWindow(false)
  }, [])

  const handleActualSize = useCallback(() => {
    setZoom(100)
    setFitToWindow(false)
    setPan({ x: 0, y: 0 })
  }, [])

  const handleFitToWindow = useCallback(() => {
    setFitToWindow(true)
    setPan({ x: 0, y: 0 })
  }, [])

  // Pan controls
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (fitToWindow || zoom <= 100) return
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    },
    [fitToWindow, zoom, pan]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
    },
    [isPanning, panStart]
  )

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsPanning(false)
  }, [])

  // Rotation with GSAP animation
  const handleRotate = useCallback(() => {
    if (!imageRef.current) {
      setRotation(prev => (prev + 90) % 360)
      return
    }

    const newRotation = (rotation + 90) % 360
    gsap.to(imageRef.current, {
      rotation: newRotation,
      duration: 0.3,
      ease: 'power2.out',
      onUpdate: () => {
        if (imageRef.current) {
          const currentRotation = gsap.getProperty(imageRef.current, 'rotation') as number
          setRotation(currentRotation)
        }
      },
      onComplete: () => {
        setRotation(newRotation)
      },
    })
  }, [rotation])

  // Animate zoom changes
  useEffect(() => {
    if (!imageRef.current || fitToWindow) return

    gsap.to(imageRef.current, {
      scale: zoom / 100,
      duration: 0.2,
      ease: 'power2.out',
    })
  }, [zoom, fitToWindow])

  // Context menu
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!file) return

      const menuItems: MenuItem[] = [
        {
          id: 'image-info',
          label: 'Image Information',
          icon: 'ℹ️',
          action: () => {
            const sizeKB = file.size ? (file.size / 1024).toFixed(2) : '0'
            alert(
              `File: ${file.name}\n` +
                `Type: ${file.mimeType || 'Unknown'}\n` +
                `Size: ${sizeKB} KB\n` +
                `Dimensions: ${imageDimensions.width} × ${imageDimensions.height}px\n` +
                `Zoom: ${zoom}%\n` +
                `Rotation: ${rotation}°`
            )
          },
        },
        {
          id: 'separator-1',
          label: '',
          separator: true,
          action: () => {},
        },
        {
          id: 'zoom-in',
          label: 'Zoom In',
          icon: '🔍+',
          action: handleZoomIn,
        },
        {
          id: 'zoom-out',
          label: 'Zoom Out',
          icon: '🔍-',
          action: handleZoomOut,
        },
        {
          id: 'actual-size',
          label: 'Actual Size',
          icon: '1:1',
          action: handleActualSize,
        },
        {
          id: 'fit-window',
          label: 'Fit to Window',
          icon: '⬜',
          action: handleFitToWindow,
        },
        {
          id: 'separator-2',
          label: '',
          separator: true,
          action: () => {},
        },
        {
          id: 'rotate',
          label: 'Rotate 90°',
          icon: '🔄',
          action: handleRotate,
        },
      ]

      showContextMenu(e.clientX, e.clientY, menuItems)
    },
    [
      file,
      imageDimensions,
      zoom,
      rotation,
      handleZoomIn,
      handleZoomOut,
      handleActualSize,
      handleFitToWindow,
      handleRotate,
      showContextMenu,
    ]
  )

  if (!file) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🖼️</div>
          <p className="text-gray-600">No image loaded</p>
        </div>
      </div>
    )
  }

  if (imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-2">Failed to load image</p>
          <p className="text-sm text-gray-500">{file.name}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-100" onContextMenu={handleContextMenu}>
      {/* Toolbar */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-gray-300 bg-gray-50">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">{file.name}</span>
          {imageLoaded && (
            <span className="text-xs text-gray-500">
              {imageDimensions.width} × {imageDimensions.height}px
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="px-2 py-1 text-sm bg-white hover:bg-gray-100 border border-gray-300 rounded transition-colors"
            title="Zoom Out"
          >
            −
          </button>
          <span className="text-sm text-gray-700 min-w-[50px] text-center">{zoom}%</span>
          <button
            onClick={handleZoomIn}
            className="px-2 py-1 text-sm bg-white hover:bg-gray-100 border border-gray-300 rounded transition-colors"
            title="Zoom In"
          >
            +
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button
            onClick={handleActualSize}
            className="px-3 py-1 text-sm bg-white hover:bg-gray-100 border border-gray-300 rounded transition-colors"
            title="Actual Size (100%)"
          >
            1:1
          </button>
          <button
            onClick={handleFitToWindow}
            className={`px-3 py-1 text-sm border rounded transition-colors ${
              fitToWindow
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-white hover:bg-gray-100 border-gray-300'
            }`}
            title="Fit to Window"
          >
            Fit
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button
            onClick={handleRotate}
            className="px-3 py-1 text-sm bg-white hover:bg-gray-100 border border-gray-300 rounded transition-colors"
            title="Rotate 90°"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Image Display */}
      <div
        className="flex-1 overflow-hidden flex items-center justify-center p-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: isPanning ? 'grabbing' : zoom > 100 && !fitToWindow ? 'grab' : 'default',
        }}
      >
        {!imageLoaded && !imageError && (
          <div className="text-gray-500">Loading image...</div>
        )}
        {imageUrl && (
          <img
            ref={imageRef}
            src={imageUrl}
            alt={file.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="select-none"
            draggable={false}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px)`,
              maxWidth: fitToWindow ? '100%' : 'none',
              maxHeight: fitToWindow ? '100%' : 'none',
              width: fitToWindow ? 'auto' : 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: imageLoaded ? 'block' : 'none',
            }}
          />
        )}
      </div>

      {/* Status Bar */}
      {imageLoaded && (
        <div className="h-8 px-4 flex items-center justify-between border-t border-gray-300 bg-gray-50 text-xs text-gray-600">
          <div>
            {file.mimeType} • {((file.size || 0) / 1024).toFixed(2)} KB
          </div>
          <div>
            {imageDimensions.width} × {imageDimensions.height}px • {zoom}% • {rotation}°
          </div>
        </div>
      )}
    </div>
  )
}
