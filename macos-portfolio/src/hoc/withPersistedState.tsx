import React, { useState, useEffect, useCallback } from 'react'
import type { PersistedStateInjectedProps } from '@/types'

export interface WithPersistedStateOptions {
  key: string
  defaultValue?: any
  storage?: 'localStorage' | 'sessionStorage'
}

export function withPersistedState<P extends object, T = any>(
  WrappedComponent: React.ComponentType<P>,
  options: WithPersistedStateOptions
) {
  const { key, defaultValue = {}, storage = 'localStorage' } = options

  return function WithPersistedStateComponent(
    props: Omit<P, keyof PersistedStateInjectedProps<T>>
  ) {
    const [persistedState, setPersistedState] = useState<T>(() => {
      // Load initial state from storage
      try {
        const storageObj = storage === 'localStorage' ? localStorage : sessionStorage
        const item = storageObj.getItem(key)
        return item ? JSON.parse(item) : defaultValue
      } catch (error) {
        console.error(`Failed to load persisted state for key "${key}":`, error)
        return defaultValue
      }
    })

    // Save to storage whenever state changes
    useEffect(() => {
      try {
        const storageObj = storage === 'localStorage' ? localStorage : sessionStorage
        storageObj.setItem(key, JSON.stringify(persistedState))
      } catch (error) {
        console.error(`Failed to save persisted state for key "${key}":`, error)
      }
    }, [persistedState])

    const updatePersistedState = useCallback((updates: Partial<T>) => {
      setPersistedState(prev => ({
        ...prev,
        ...updates,
      }))
    }, [])

    const injectedProps: PersistedStateInjectedProps<T> = {
      persistedState,
      updatePersistedState,
    }

    return <WrappedComponent {...(props as P)} {...injectedProps} />
  }
}
