import { useState, useEffect } from 'react'

interface NetworkInformation extends EventTarget {
  downlink?: number
  downlinkMax?: number
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
  rtt?: number
  saveData?: boolean
  type?:
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'none'
    | 'wifi'
    | 'wimax'
    | 'other'
    | 'unknown'
  addEventListener(type: 'change', listener: (this: NetworkInformation, ev: Event) => any): void
  removeEventListener(type: 'change', listener: (this: NetworkInformation, ev: Event) => any): void
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

export interface NetworkState {
  isOnline: boolean
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown'
  downlink: number // Mbps
  rtt: number // milliseconds
  saveData: boolean
  type: string
  isSupported: boolean
}

export const useNetwork = (): NetworkState => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [effectiveType, setEffectiveType] = useState<
    'slow-2g' | '2g' | '3g' | '4g' | 'unknown'
  >('4g')
  const [downlink, setDownlink] = useState(10)
  const [rtt, setRtt] = useState(50)
  const [saveData, setSaveData] = useState(false)
  const [type, setType] = useState('wifi')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Handle online/offline events
    const handleOnline = () => {
      console.log('🌐 Network: Online')
      setIsOnline(true)
    }

    const handleOffline = () => {
      console.log('📡 Network: Offline')
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Get network connection info
    const nav = navigator as NavigatorWithConnection
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection

    if (connection) {
      setIsSupported(true)

      const updateNetworkInfo = () => {
        const effectiveTypeValue = connection.effectiveType || '4g'
        const downlinkValue = connection.downlink || 10
        const rttValue = connection.rtt || 50
        const saveDataValue = connection.saveData || false
        const typeValue = connection.type || 'wifi'

        console.log('✅ Network Information API connected!')
        console.log(`📶 Connection Type: ${typeValue}`)
        console.log(`⚡ Effective Type: ${effectiveTypeValue}`)
        console.log(`⬇️ Downlink: ${downlinkValue} Mbps`)
        console.log(`⏱️ RTT: ${rttValue} ms`)
        console.log(`💾 Save Data: ${saveDataValue}`)

        setEffectiveType(effectiveTypeValue)
        setDownlink(downlinkValue)
        setRtt(rttValue)
        setSaveData(saveDataValue)
        setType(typeValue)
      }

      updateNetworkInfo()

      const handleConnectionChange = () => {
        console.log('🔄 Network connection changed')
        updateNetworkInfo()
      }

      connection.addEventListener('change', handleConnectionChange)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        connection.removeEventListener('change', handleConnectionChange)
      }
    } else {
      console.warn('⚠️ Network Information API not supported')
      console.log('📶 Using simulated network data')
      setIsSupported(false)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return {
    isOnline,
    effectiveType,
    downlink,
    rtt,
    saveData,
    type,
    isSupported,
  }
}
