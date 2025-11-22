import gsap from 'gsap'

// Animation presets - centralized durations and easings
export const ANIMATION_PRESETS = {
  // Durations
  FAST: 0.15,
  BASE: 0.25,
  SLOW: 0.35,
  WINDOW_OPEN: 0.45,
  WINDOW_CLOSE: 0.32,
  DOCK_BOUNCE: 0.6,
  MISSION_CONTROL: 0.5,

  // Easings
  EASE_OUT: 'power3.out',
  EASE_IN: 'power2.in',
  EASE_IN_OUT: 'power2.inOut',
  BOUNCE: 'back.out(1.7)',
  ELASTIC: 'elastic.out(1, 0.5)',
  SMOOTH: 'power1.inOut',
} as const

// Get animation scale from preferences
export const getAnimationScale = (): number => {
  // This will be integrated with preferences store
  // For now, check for reduced motion preference
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return 0.01 // Nearly instant
  }
  return 1
}

// Apply animation scale to duration
export const scaleDuration = (duration: number): number => {
  return duration * getAnimationScale()
}

// Window animations
export const createWindowOpenAnimation = (
  element: HTMLElement,
  fromPosition?: { x: number; y: number }
) => {
  const scale = getAnimationScale()

  if (scale < 0.1) {
    // Skip animation for reduced motion
    gsap.set(element, { opacity: 1, scale: 1 })
    return gsap.timeline()
  }

  const tl = gsap.timeline()

  if (fromPosition) {
    // Animate from dock icon position
    const rect = element.getBoundingClientRect()
    const deltaX = fromPosition.x - rect.left
    const deltaY = fromPosition.y - rect.top

    tl.from(element, {
      duration: scaleDuration(ANIMATION_PRESETS.WINDOW_OPEN),
      x: deltaX,
      y: deltaY,
      scale: 0.1,
      opacity: 0,
      ease: ANIMATION_PRESETS.EASE_OUT,
    })
  } else {
    // Default center scale animation
    tl.from(element, {
      duration: scaleDuration(ANIMATION_PRESETS.WINDOW_OPEN),
      scale: 0.85,
      opacity: 0,
      ease: ANIMATION_PRESETS.EASE_OUT,
    })
  }

  return tl
}

export const createWindowCloseAnimation = (
  element: HTMLElement,
  toPosition?: { x: number; y: number }
) => {
  const scale = getAnimationScale()

  if (scale < 0.1) {
    gsap.set(element, { opacity: 0 })
    return gsap.timeline()
  }

  const tl = gsap.timeline()

  if (toPosition) {
    // Animate to dock icon position
    const rect = element.getBoundingClientRect()
    const deltaX = toPosition.x - rect.left
    const deltaY = toPosition.y - rect.top

    tl.to(element, {
      duration: scaleDuration(ANIMATION_PRESETS.WINDOW_CLOSE),
      x: deltaX,
      y: deltaY,
      scale: 0.1,
      opacity: 0,
      ease: ANIMATION_PRESETS.EASE_IN,
    })
  } else {
    // Default shrink animation
    tl.to(element, {
      duration: scaleDuration(ANIMATION_PRESETS.WINDOW_CLOSE),
      scale: 0.85,
      opacity: 0,
      ease: ANIMATION_PRESETS.EASE_IN,
    })
  }

  return tl
}

export const createWindowDragLiftAnimation = (element: HTMLElement) => {
  const scale = getAnimationScale()

  if (scale < 0.1) return gsap.timeline()

  return gsap.to(element, {
    duration: scaleDuration(0.12),
    y: -6,
    scale: 1.01,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.15)',
    ease: ANIMATION_PRESETS.EASE_OUT,
  })
}

export const createWindowDragDropAnimation = (element: HTMLElement) => {
  const scale = getAnimationScale()

  if (scale < 0.1) return gsap.timeline()

  return gsap.to(element, {
    duration: scaleDuration(0.12),
    y: 0,
    scale: 1,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
    ease: ANIMATION_PRESETS.EASE_IN,
  })
}

// Dock animations
export const createDockIconHoverAnimation = (element: HTMLElement) => {
  const scale = getAnimationScale()

  if (scale < 0.1) return gsap.timeline()

  return gsap.to(element, {
    duration: scaleDuration(ANIMATION_PRESETS.FAST),
    scale: 1.2,
    y: -8,
    ease: ANIMATION_PRESETS.EASE_OUT,
  })
}

export const createDockIconLeaveAnimation = (element: HTMLElement) => {
  const scale = getAnimationScale()

  if (scale < 0.1) return gsap.timeline()

  return gsap.to(element, {
    duration: scaleDuration(ANIMATION_PRESETS.FAST),
    scale: 1,
    y: 0,
    ease: ANIMATION_PRESETS.EASE_IN,
  })
}

export const createDockIconBounceAnimation = (element: HTMLElement) => {
  const scale = getAnimationScale()

  if (scale < 0.1) return gsap.timeline()

  const tl = gsap.timeline()

  tl.to(element, {
    duration: scaleDuration(ANIMATION_PRESETS.DOCK_BOUNCE),
    y: -20,
    ease: ANIMATION_PRESETS.BOUNCE,
    yoyo: true,
    repeat: 1,
  })

  return tl
}

export const createDockIconLaunchAnimation = (element: HTMLElement) => {
  const scale = getAnimationScale()

  if (scale < 0.1) return gsap.timeline()

  const tl = gsap.timeline()

  // Scale up
  tl.to(element, {
    duration: scaleDuration(0.2),
    scale: 1.3,
    ease: ANIMATION_PRESETS.EASE_OUT,
  })

  // Scale back
  tl.to(element, {
    duration: scaleDuration(0.15),
    scale: 1,
    ease: ANIMATION_PRESETS.EASE_IN,
  })

  return tl
}

// Overlay animations
export const createSpotlightOpenAnimation = (element: HTMLElement) => {
  const scale = getAnimationScale()

  if (scale < 0.1) {
    gsap.set(element, { opacity: 1, scale: 1 })
    return gsap.timeline()
  }

  const tl = gsap.timeline()

  tl.from(element, {
    duration: scaleDuration(ANIMATION_PRESETS.BASE),
    scale: 0.95,
    opacity: 0,
    ease: ANIMATION_PRESETS.EASE_OUT,
  })

  return tl
}

export const createSpotlightCloseAnimation = (element: HTMLElement) => {
  const scale = getAnimationScale()

  if (scale < 0.1) {
    gsap.set(element, { opacity: 0 })
    return gsap.timeline()
  }

  return gsap.to(element, {
    duration: scaleDuration(ANIMATION_PRESETS.FAST),
    scale: 0.95,
    opacity: 0,
    ease: ANIMATION_PRESETS.EASE_IN,
  })
}

export const createNotificationSlideInAnimation = (element: HTMLElement) => {
  const scale = getAnimationScale()

  if (scale < 0.1) {
    gsap.set(element, { x: 0, opacity: 1 })
    return gsap.timeline()
  }

  return gsap.from(element, {
    duration: scaleDuration(ANIMATION_PRESETS.BASE),
    x: 400,
    opacity: 0,
    ease: ANIMATION_PRESETS.EASE_OUT,
  })
}

export const createNotificationSlideOutAnimation = (element: HTMLElement) => {
  const scale = getAnimationScale()

  if (scale < 0.1) {
    gsap.set(element, { opacity: 0 })
    return gsap.timeline()
  }

  return gsap.to(element, {
    duration: scaleDuration(ANIMATION_PRESETS.FAST),
    x: 400,
    opacity: 0,
    ease: ANIMATION_PRESETS.EASE_IN,
  })
}

// Mission Control animations
export const createMissionControlZoomOutAnimation = (elements: HTMLElement[]) => {
  const scale = getAnimationScale()

  if (scale < 0.1) {
    elements.forEach(el => gsap.set(el, { scale: 0.3, opacity: 1 }))
    return gsap.timeline()
  }

  const tl = gsap.timeline()

  elements.forEach((element, index) => {
    tl.to(
      element,
      {
        duration: scaleDuration(ANIMATION_PRESETS.MISSION_CONTROL),
        scale: 0.3,
        opacity: 1,
        ease: ANIMATION_PRESETS.EASE_OUT,
      },
      index * 0.02 // Slight stagger
    )
  })

  return tl
}

export const createMissionControlZoomInAnimation = (elements: HTMLElement[]) => {
  const scale = getAnimationScale()

  if (scale < 0.1) {
    elements.forEach(el => gsap.set(el, { scale: 1, opacity: 1 }))
    return gsap.timeline()
  }

  const tl = gsap.timeline()

  elements.forEach((element, index) => {
    tl.to(
      element,
      {
        duration: scaleDuration(ANIMATION_PRESETS.MISSION_CONTROL),
        scale: 1,
        opacity: 1,
        ease: ANIMATION_PRESETS.EASE_IN_OUT,
      },
      index * 0.02
    )
  })

  return tl
}

// Context menu animation
export const createContextMenuAnimation = (element: HTMLElement) => {
  const scale = getAnimationScale()

  if (scale < 0.1) {
    gsap.set(element, { opacity: 1, scale: 1 })
    return gsap.timeline()
  }

  return gsap.from(element, {
    duration: scaleDuration(ANIMATION_PRESETS.FAST),
    scale: 0.9,
    opacity: 0,
    transformOrigin: 'top left',
    ease: ANIMATION_PRESETS.EASE_OUT,
  })
}

// Utility: Kill all animations on an element
export const killAnimations = (element: HTMLElement) => {
  gsap.killTweensOf(element)
}

// Utility: Create a stagger animation
export const createStaggerAnimation = (
  elements: HTMLElement[],
  animationFn: (el: HTMLElement) => gsap.core.Tween | gsap.core.Timeline,
  staggerDelay: number = 0.05
) => {
  const scale = getAnimationScale()
  const tl = gsap.timeline()

  elements.forEach((element, index) => {
    tl.add(animationFn(element), index * staggerDelay * scale)
  })

  return tl
}

// Utility: Pulse animation (for notifications, alerts)
export const createPulseAnimation = (element: HTMLElement, repeat: number = 2) => {
  const scale = getAnimationScale()

  if (scale < 0.1) return gsap.timeline()

  return gsap.to(element, {
    duration: scaleDuration(0.3),
    scale: 1.05,
    ease: ANIMATION_PRESETS.SMOOTH,
    yoyo: true,
    repeat: repeat * 2 - 1,
  })
}

// Utility: Shake animation (for errors)
export const createShakeAnimation = (element: HTMLElement) => {
  const scale = getAnimationScale()

  if (scale < 0.1) return gsap.timeline()

  const tl = gsap.timeline()

  tl.to(element, {
    duration: scaleDuration(0.1),
    x: -10,
    ease: ANIMATION_PRESETS.SMOOTH,
  })
    .to(element, {
      duration: scaleDuration(0.1),
      x: 10,
      ease: ANIMATION_PRESETS.SMOOTH,
    })
    .to(element, {
      duration: scaleDuration(0.1),
      x: -10,
      ease: ANIMATION_PRESETS.SMOOTH,
    })
    .to(element, {
      duration: scaleDuration(0.1),
      x: 0,
      ease: ANIMATION_PRESETS.SMOOTH,
    })

  return tl
}
