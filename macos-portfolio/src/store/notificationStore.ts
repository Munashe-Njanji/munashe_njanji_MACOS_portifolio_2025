import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { NotificationStore, Notification } from '@/types'

const DEFAULT_TTL = 5000 // 5 seconds

export const useNotificationStore = create<NotificationStore>()(
  immer((set, get) => ({
    notifications: [],
    doNotDisturb: false,

    pushNotification: notification => {
      const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const timestamp = Date.now()
      const ttl = notification.ttl || DEFAULT_TTL

      const newNotification: Notification = {
        ...notification,
        id,
        timestamp,
        ttl,
      }

      set(state => {
        state.notifications.unshift(newNotification)

        // Limit to 50 notifications
        if (state.notifications.length > 50) {
          state.notifications = state.notifications.slice(0, 50)
        }
      })

      // Auto-dismiss after TTL
      if (ttl > 0) {
        setTimeout(() => {
          get().dismissNotification(id)
        }, ttl)
      }

      return id
    },

    dismissNotification: (id: string) => {
      set(state => {
        const index = state.notifications.findIndex(n => n.id === id)
        if (index !== -1) {
          state.notifications.splice(index, 1)
        }
      })
    },

    clearAll: () => {
      set(state => {
        state.notifications = []
      })
    },

    toggleDoNotDisturb: () => {
      set(state => {
        state.doNotDisturb = !state.doNotDisturb
      })
    },
  }))
)
