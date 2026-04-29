/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, X } from 'lucide-react'

const ToastContext = createContext(null)

function uid() {
  return Math.random().toString(16).slice(2)
}

void motion

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const api = useMemo(() => {
    return {
      pushToast: ({ type, title, message, durationMs = 3200 }) => {
        const id = uid()
        setToasts((prev) => [...prev, { id, type, title, message, durationMs }])

        window.setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        }, durationMs)
      },
      removeToast: (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      },
    }
  }, [])

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div className="fixed top-4 right-4 z-[100] pointer-events-none">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto mb-3"
            >
              <ToastCard toast={t} onClose={() => api.removeToast(t.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

function ToastCard({ toast, onClose }) {
  const isSuccess = toast.type === 'success'
  const isError = toast.type === 'error'

  const icon = isSuccess ? (
    <CheckCircle2 size={18} />
  ) : isError ? (
    <AlertTriangle size={18} />
  ) : (
    <AlertTriangle size={18} />
  )

  return (
    <div
      className={`w-[360px] max-w-[calc(100vw-32px)] rounded-2xl border shadow-[0_0_0_1px_rgba(124,58,237,0.08)] p-4 backdrop-blur ${
        isSuccess
          ? 'bg-[#10b981]/10 border-[#10b981]/20 text-[#f1f5f9]'
          : isError
            ? 'bg-[#ef4444]/10 border-[#ef4444]/20 text-[#f1f5f9]'
            : 'bg-[#111118]/60 border-[#1e1e2e] text-[#f1f5f9]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 ${
              isSuccess
                ? 'text-[#10b981]'
                : isError
                  ? 'text-[#ef4444]'
                  : 'text-[#7c3aed]'
            }`}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <div className="font-semibold tracking-tight text-sm">
              {toast.title}
            </div>
            {toast.message ? (
              <div className="text-sm text-[#64748b] mt-1 leading-relaxed">
                {toast.message}
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg border border-transparent hover:border-[#1e1e2e] hover:bg-[#111118]/40 transition duration-200 text-[#64748b]"
          aria-label="Dismiss toast"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

