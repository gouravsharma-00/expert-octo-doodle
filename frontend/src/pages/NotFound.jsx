import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

void motion

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f] text-[#f1f5f9] p-6">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(124,58,237,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.10)_1px,transparent_1px)] [background-size:48px_48px]" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md bg-[#111118]/55 backdrop-blur border border-[#1e1e2e] rounded-2xl shadow-[0_0_0_1px_rgba(124,58,237,0.10)] p-8"
      >
        <div className="text-sm text-[#64748b] tracking-tight">Page not found</div>
        <div className="mt-2 flex items-baseline gap-3">
          <div className="text-6xl font-bold tracking-tight text-[#a855f7]">404</div>
          <div className="text-xl font-semibold">This route doesn’t exist.</div>
        </div>
        <p className="text-[#64748b] mt-4 leading-relaxed text-sm">
          Double-check the URL or jump back to the landing page.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#7c3aed] hover:to-[#a855f7] transition duration-200 shadow-[0_0_0_1px_rgba(124,58,237,0.18)]"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}

