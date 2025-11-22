import React, { useCallback } from 'react'
import type { WindowControlsInjectedProps } from '@/types'
import { useWindowStore } from '@/store'

export interface WithWindowControlsOptions {
  windowId: string
}

export function withWindowControls<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: WithWindowControlsOptions
) {
  return function WithWindowControlsComponent(
    props: Omit<P, keyof WindowControlsInjectedProps> & { windowId?: string }
  ) {
    const windowId = options?.windowId || props.windowId

    if (!windowId) {
      throw new Error('withWindowControls requires a windowId')
    }

    const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useWindowStore()

    const window = windows.find(w => w.id === windowId)

    const handleClose = useCallback(() => {
      closeWindow(windowId)
    }, [windowId])

    const handleMinimize = useCallback(() => {
      minimizeWindow(windowId)
    }, [windowId])

    const handleMaximize = useCallback(() => {
      maximizeWindow(windowId)
    }, [windowId])

    const handleFocus = useCallback(() => {
      focusWindow(windowId)
    }, [windowId])

    const injectedProps: WindowControlsInjectedProps = {
      onClose: handleClose,
      onMinimize: handleMinimize,
      onMaximize: handleMaximize,
      onFocus: handleFocus,
      isFocused: window?.state.focused || false,
      isMinimized: window?.state.minimized || false,
      isMaximized: window?.state.maximized || false,
    }

    return <WrappedComponent {...(props as P)} {...injectedProps} />
  }
}
