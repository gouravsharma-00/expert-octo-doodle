import { motion } from 'framer-motion'

void motion

export function Skeleton({ className = '', height = 16 }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#111118]/30 ${className}`}
      style={{ height }}
    >
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]"
        initial={{ x: '-120%' }}
        animate={{ x: '120%' }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

