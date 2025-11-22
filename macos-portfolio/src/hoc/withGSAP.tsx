import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import type { GSAPInjectedProps } from '@/types'

export interface WithGSAPOptions {
  createTimeline: (ref: React.RefObject<HTMLElement>, props: any) => gsap.core.Timeline
  playOnMount?: boolean
  reverseOnUnmount?: boolean
}

export function withGSAP<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithGSAPOptions
) {
  return function WithGSAPComponent(props: Omit<P, keyof GSAPInjectedProps>) {
    const animationRef = useRef<HTMLDivElement>(null)
    const timelineRef = useRef<gsap.core.Timeline | null>(null)

    useEffect(() => {
      if (!animationRef.current) return

      // Create GSAP context for automatic cleanup
      const ctx = gsap.context(() => {
        if (animationRef.current) {
          // Create timeline
          timelineRef.current = options.createTimeline(
            animationRef as React.RefObject<HTMLElement>,
            props
          )

          // Play on mount if specified
          if (options.playOnMount !== false) {
            timelineRef.current.play()
          }
        }
      }, animationRef)

      // Cleanup function
      return () => {
        if (options.reverseOnUnmount && timelineRef.current) {
          timelineRef.current.reverse()
        }
        ctx.revert() // This will kill all animations in the context
      }
    }, [props])

    const injectedProps: GSAPInjectedProps = {
      animationRef: animationRef as React.RefObject<HTMLElement>,
    }

    return (
      <div ref={animationRef}>
        <WrappedComponent {...(props as P)} {...injectedProps} />
      </div>
    )
  }
}
