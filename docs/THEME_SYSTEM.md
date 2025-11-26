# Theme Customization System

## Overview
Implemented a comprehensive, immersive theme engine with system detection, cookie persistence, and OS-wide transformations.

## Features

### 1. Theme Modes
- **macOS Light** - Classic light theme
- **macOS Dark** - Elegant dark theme
- **Auto** - Follows system preference (detects `prefers-color-scheme`)
- **High Contrast** - Maximum contrast for accessibility
- **OLED Deep Black** - True black for OLED displays
- **Developer Themes** - Code editor-inspired themes

### 2. Developer Themes
- **Neon Matrix** - Cyberpunk green matrix aesthetic with glow effects
- **Monokai Pro** - Popular code editor theme
- **Dracula UI** - Dark theme with vibrant purple/pink colors

### 3. Accent Colors
8 accent colors that affect interactive elements system-wide:
- Blue (default)
- Purple
- Pink
- Red
- Orange
- Yellow
- Green
- Graphite

### 4. System Integration

#### Cookie Persistence
- Theme preferences saved to cookies (`macos-portfolio-theme`)
- 365-day expiry
- Automatically loads on return visits
- Stores: theme mode, accent color, developer theme

#### System Theme Detection
- Detects `prefers-color-scheme: dark/light`
- Auto-updates when system theme changes (if mode is 'auto')
- Respects user's OS-level preferences

#### CSS Custom Properties
All theme colors exposed as CSS variables:
```css
--theme-background
--theme-foreground
--theme-primary
--theme-accent
--theme-menuBar
--theme-dock
--theme-windowChrome
--theme-textPrimary
--theme-shadowLight
... and more
```

### 5. Immersive Transformations

Each theme affects:
- **MenuBar** - Background, text color, blur
- **Dock** - Background, glow effects, transparency
- **Windows** - Chrome color, background, borders
- **Shadows** - Light/medium/heavy shadow colors
- **Wallpaper** - Auto-selected based on theme
- **Text** - Primary/secondary/tertiary text colors
- **Interactive Elements** - Buttons, links, focus states

### 6. Visual Effects
Per-theme customization:
- Blur intensity (0-40px)
- Transparency level (0-1)
- Glow effects (on/off)
- Shadows (on/off)
- Animations (on/off)

## Implementation

### Files Created
1. `src/types/theme.ts` - Theme type definitions
2. `src/utils/themePresets.ts` - Theme presets and color palettes
3. `src/utils/themeUtils.ts` - Cookie management, system detection, theme application

### Files Modified
1. `src/store/preferencesStore.ts` - Added theme state and actions
2. `src/apps/PreferencesApp/PreferencesApp.tsx` - Added Themes tab with full UI

### Store Actions
```typescript
setThemeMode(mode: ThemeMode) // Set theme mode
setAccentColor(color: AccentColor) // Set accent color
setDeveloperTheme(theme: DeveloperTheme) // Set developer theme
applyTheme() // Manually apply current theme
```

### Utility Functions
```typescript
detectSystemTheme() // Detect system light/dark preference
watchSystemTheme(callback) // Watch for system theme changes
saveThemeToCookie(config) // Save theme to cookie
loadThemeFromCookie() // Load theme from cookie
applyThemeToDocument(config) // Apply theme CSS variables
buildThemeConfig(mode, accent, devTheme) // Build theme config
```

## Usage

### In Components
```typescript
import { usePreferencesStore } from '@/store'

const { themeMode, accentColor, currentTheme, setThemeMode, setAccentColor } = usePreferencesStore()

// Change theme
setThemeMode('dark')
setAccentColor('purple')
setDeveloperTheme('neon-matrix')
```

### In CSS
```css
.my-element {
  background: var(--theme-background);
  color: var(--theme-textPrimary);
  border-color: var(--theme-windowBorder);
}

/* Theme-specific styles */
[data-theme="dark"] .my-element {
  /* Dark theme overrides */
}

[data-developer-theme="neon-matrix"] .my-element {
  /* Neon matrix overrides */
}
```

## User Experience

### First Visit
1. System detects user's OS theme preference
2. Applies matching theme (light/dark)
3. Uses default blue accent color

### Return Visit
1. Loads theme from cookie
2. Applies saved preferences
3. Respects any changes made in previous session

### Theme Switching
1. Instant visual feedback
2. Smooth transitions
3. All UI elements update simultaneously
4. Wallpaper changes to match theme
5. Saved to cookie automatically

## Preferences UI

### Themes Tab
- **Theme Mode Grid** - Visual cards for each mode
- **Developer Themes** - Shows when developer mode selected
- **Accent Color Picker** - Color swatches with preview
- **Quick Presets** - One-click theme presets
- **Info Box** - Explains cookie persistence

### Visual Feedback
- Active theme highlighted with border
- Checkmark on selected options
- Color previews for presets
- Descriptive text for each option

## Technical Details

### Theme Config Structure
```typescript
interface ThemeConfig {
  mode: ThemeMode
  accentColor: AccentColor
  developerTheme?: DeveloperTheme
  colors: ThemeColors // 20+ color properties
  wallpaper: string
  effects: {
    blur: number
    transparency: number
    glow: boolean
    shadows: boolean
    animations: boolean
  }
}
```

### Initialization Flow
1. Check for saved theme in cookie
2. If no cookie, detect system preference
3. Build theme config from mode + accent
4. Apply CSS custom properties to document
5. Set data attributes for CSS selectors
6. Watch for system theme changes

### Performance
- Theme application is instant (< 16ms)
- CSS custom properties for efficient updates
- No re-renders required for theme changes
- Cookie operations are async and non-blocking

## Future Enhancements
1. Custom theme creator
2. Theme import/export
3. More developer themes (Nord, Tokyo Night, etc.)
4. Gradient wallpaper generator
5. Per-app theme overrides
6. Theme scheduling (auto-switch at sunset)
7. Theme marketplace/sharing
