import { useState, useEffect } from 'react'

interface BatteryManager extends EventTarget {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
  addEventListener(
    type: 'chargingchange' | 'chargingtimechange' | 'dischargingtimechange' | 'levelchange',
    listener: (this: BatteryManager, ev: Event) => any,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener(
    type: 'chargingchange' | 'chargingtimechange' | 'dischargingtimechange' | 'levelchange',
    listener: (this: BatteryManager, ev: Event) => any,
    options?: boolean | EventListenerOptions
  ): void
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>
}

export interface BatteryState {
  level: number
  isCharging: boolean
  isSupported: boolean
}

export const useBattery = (): BatteryState => {
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [isCharging, setIsCharging] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    let battery: BatteryManager | null = null

    const getBatteryStatus = async () => {
      const nav = navigator as NavigatorWithBattery

      if ('getBattery' in nav && typeof nav.getBattery === 'function') {
        try {
          battery = await nav.getBattery()
          setIsSupported(true)

          // Set initial values
          const initialLevel = Math.round(battery.level * 100)
          const initialCharging = battery.charging
          
          console.log('✅ Battery API connected successfully!')
          console.log(`📊 Battery Level: ${initialLevel}%`)
          console.log(`🔌 Charging: ${initialCharging ? 'Yes' : 'No'}`)
          
          setBatteryLevel(initialLevel)
          setIsCharging(initialCharging)

          // Update on level change
          const handleLevelChange = () => {
            if (battery) {
              const newLevel = Math.round(battery.level * 100)
              console.log(`🔋 Battery level changed: ${newLevel}%`)
              setBatteryLevel(newLevel)
            }
          }

          // Update on charging change
          const handleChargingChange = () => {
            if (battery) {
              const newCharging = battery.charging
              console.log(`⚡ Charging status changed: ${newCharging ? 'Charging' : 'Not charging'}`)
              setIsCharging(newCharging)
            }
          }

          battery.addEventListener('levelchange', handleLevelChange)
          battery.addEventListener('chargingchange', handleChargingChange)

          // Cleanup function
          return () => {
            if (battery) {
              battery.removeEventListener('levelchange', handleLevelChange)
              battery.removeEventListener('chargingchange', handleChargingChange)
            }
          }
        } catch (error) {
          console.warn('⚠️ Battery API error:', error)
          console.log('📱 Using simulated battery data (85%)')
          setIsSupported(false)
        }
      } else {
        console.warn('⚠️ Battery API not supported in this browser')
        console.log('📱 Using simulated battery data (85%)')
        setIsSupported(false)
      }
    }

    getBatteryStatus()
  }, [])

  return {
    level: batteryLevel,
    isCharging,
    isSupported,
  }
}
