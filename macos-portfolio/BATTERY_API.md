# Battery API Implementation

## Overview
The macOS Portfolio now includes real-time battery monitoring using the Browser Battery Status API.

## Features
- **Real-time battery level** - Shows actual device battery percentage
- **Charging status** - Detects when device is plugged in/unplugged
- **Live updates** - Automatically updates when battery level or charging status changes
- **Graceful fallback** - Shows simulated 85% battery when API is unavailable

## Where to See It
1. **Menu Bar** - Top-right corner shows battery icon with percentage
2. **System Preferences** - Open Preferences app → Battery tab for detailed view

## Browser Support
The Battery Status API works in:
- ✅ **Chrome/Edge** (Desktop & Android)
- ✅ **Opera** (Desktop & Android)
- ❌ **Firefox** (Removed for privacy reasons)
- ❌ **Safari** (Not supported)

## Testing the API

### Check Console Logs
Open your browser's Developer Tools (F12) and look for these messages:

**When API is working:**
```
✅ Battery API connected successfully!
📊 Battery Level: 87%
🔌 Charging: No
```

**When API is not available:**
```
⚠️ Battery API not supported in this browser
📱 Using simulated battery data (85%)
```

### Test Charging Detection
1. Open the app in Chrome/Edge on a laptop
2. Check the battery indicator in the menu bar
3. Plug in or unplug your charger
4. Watch the console for: `⚡ Charging status changed: Charging`
5. The battery icon color will change to green when charging

### Test Level Changes
Battery level changes are detected automatically, but they happen slowly in real life. To see it work:
1. Open the app and note the current battery level
2. Wait for your battery to naturally drain/charge by 1%
3. The display will update automatically
4. Console will show: `🔋 Battery level changed: XX%`

## Implementation Details

### Custom Hook: `useBattery()`
Located in `src/hooks/useBattery.ts`, this hook:
- Connects to the Battery Status API on mount
- Sets up event listeners for level and charging changes
- Returns current battery state
- Cleans up listeners on unmount

### Usage Example
```typescript
import { useBattery } from '@/hooks'

function MyComponent() {
  const { level, isCharging, isSupported } = useBattery()
  
  return (
    <div>
      Battery: {level}%
      {isCharging && ' (Charging)'}
      {!isSupported && ' (Simulated)'}
    </div>
  )
}
```

## Fallback Behavior
When the Battery API is not available:
- Shows 85% battery level (simulated)
- Shows "Not Charging" status
- Displays a notice in System Preferences Battery tab
- All UI elements still work normally

## Privacy Note
Some browsers (like Firefox) have removed the Battery Status API due to privacy concerns, as it could potentially be used for fingerprinting. The fallback ensures the app works everywhere.
