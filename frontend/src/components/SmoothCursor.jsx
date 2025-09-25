import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function SmoothCursor() {
  const cursorRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const xSpring = useSpring(x, { stiffness: 300, damping: 25, mass: 0.5 })
  const ySpring = useSpring(y, { stiffness: 300, damping: 25, mass: 0.5 })

  useEffect(() => {
    const handler = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener("mousemove", handler, { passive: true })
    return () => window.removeEventListener("mousemove", handler)
  }, [x, y])

  return (
    <motion.div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[999] hidden md:block"
      style={{ 
        translateX: xSpring, 
        translateY: ySpring,
        transform: "translate(-50%, -50%)"
      }}
    >
      {/* Outer glow */}
      <div className="relative">
        <div className="h-8 w-8 rounded-full bg-dark-green/20 blur-md animate-pulse" />
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-dark-green/80 shadow-lg" />
      </div>
    </motion.div>
  )
}

export default SmoothCursor