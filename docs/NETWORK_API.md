# Network Information API Implementation

## Overview
The macOS Portfolio now includes real-time network monitoring using the Browser Network Information API.

## Features
- **Real-time connection status** - Shows if device is online/offline
- **Connection type detection** - Identifies WiFi, cellular, ethernet, etc.
- **Network speed** - Shows download speed in Mbps
- **Latency monitoring** - Displays round-trip time (RTT) in milliseconds
- **Effective connection type** - Shows 2G, 3G, 4G classification
- **Visual WiFi strength indicator** - Dynamic icon based on connection quality
- **Graceful fallback** - Shows simulated data when API is unavailable

## Where to See It
1. **Menu Bar** - Top-right corner shows WiFi icon with signal strength
2. **Click WiFi Icon** - Opens dropdown with detailed network information

## Browser Support
The Network Information API works in:
- ✅ **Chrome/Edge** (Desktop & Android) - Full support
- ✅ **Opera** (Desktop & Android) - Full support
- ⚠️ **Firefox** - Partial support (online/offline only)
- ❌ **Safari** - Not supported

## Testing the API

### Check Console Logs
Open your browser's Developer Tools (F12) and look for these messages:

**When API is working:**
```
✅ Network Information API connected!
📶 Connection Type: wifi
⚡ Effective Type: 4g
⬇️ Downlink: 10 Mbps
⏱️ RTT: 50 ms
💾 Save Data: false
```

**When API is not available:**
```
⚠️ Network Information API not supported
📶 Using simulated network data
```

### Test Connection Changes
1. Open the app in Chrome/Edge
2. Click the WiFi icon in the menu bar
3. Try these tests:
   - **Go offline**: Turn off WiFi/disconnect ethernet
   - **Go online**: Reconnect to network
   - **Switch networks**: Change from WiFi to mobile hotspot
4. Watch the console for: `🔄 Network connection changed`
5. The WiFi icon will update automatically

### WiFi Strength Indicator
The WiFi icon shows signal strength based on connection quality:
- **3 bars (full)**: 4G connection
- **2 bars (medium)**: 3G connection
- **1 bar (weak)**: 2G connection
- **Crossed out**: Offline

## Network Information Displayed

### Connection Type
Shows the physical connection method:
- `wifi` - WiFi connection
- `ethernet` - Wired connection
- `cellular` - Mobile data
- `bluetooth` - Bluetooth tethering
- `unknown` - Cannot determine

### Effective Type
Network quality classification:
- `4g` - High-speed connection (>= 10 Mbps)
- `3g` - Medium-speed connection
- `2g` - Slow connection
- `slow-2g` - Very slow connection

### Download Speed (Downlink)
- Measured in Megabits per second (Mbps)
- Represents the maximum downlink speed
- Updates when network conditions change

### Latency (RTT)
- Round-Trip Time in milliseconds
- Lower is better (< 100ms is good)
- Affects responsiveness of web apps

## Implementation Details

### Custom Hook: `useNetwork()`
Located in `src/hooks/useNetwork.ts`, this hook:
- Connects to the Network Information API on mount
- Monitors online/offline events
- Sets up event listeners for connection changes
- Returns current network state
- Cleans up listeners on unmount

### Usage Example
```typescript
import { useNetwork } from '@/hooks'

function MyComponent() {
  const { isOnline, effectiveType, downlink, rtt, type, isSupported } = useNetwork()
  
  return (
    <div>
      Status: {isOnline ? 'Online' : 'Offline'}
      Type: {type}
      Speed: {downlink} Mbps
      Latency: {rtt} ms
      Quality: {effectiveType}
      {!isSupported && ' (Simulated)'}
    </div>
  )
}
```

## Fallback Behavior
When the Network Information API is not available:
- Shows online/offline status (always available)
- Shows simulated 4G connection
- Shows 10 Mbps download speed
- Shows 50ms latency
- Shows "wifi" as connection type
- Displays a notice in the WiFi dropdown
- All UI elements still work normally

## Real-World Use Cases
This API is useful for:
- **Adaptive streaming** - Adjust video quality based on connection
- **Preloading** - Only preload resources on fast connections
- **Save data mode** - Respect user's data saving preferences
- **UX optimization** - Show appropriate UI for connection speed
- **Analytics** - Track user connection quality

## Privacy Note
The Network Information API provides general connection information but doesn't expose:
- Specific network names (SSID)
- IP addresses
- MAC addresses
- Exact location data

The API is designed to help optimize user experience without compromising privacy.
