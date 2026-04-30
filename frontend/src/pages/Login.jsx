import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import API from '../services/api'
import { useToast } from '../components/ui/ToastProvider'

void motion

export default function Login() {
  const { pushToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('email', res.data.email)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      pushToast({
        type: 'error',
        title: 'Login failed',
        message: err.response?.data?.message || 'Login failed',
      })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f] text-[#f1f5f9] flex items-center justify-center p-6 font-sans">
      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(124,58,237,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.10)_1px,transparent_1px)] [background-size:48px_48px]" />
      <motion.div
        className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[#7c3aed]/20 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={
          error
            ? { opacity: 1, y: 0, x: [0, -10, 10, -8, 8, 0] }
            : { opacity: 1, y: 0 }
        }
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md bg-[#111118]/55 backdrop-blur border border-[#1e1e2e] rounded-2xl shadow-[0_0_0_1px_rgba(124,58,237,0.10)] p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#a855f7] hover:text-[#f1f5f9] transition duration-200"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl border border-[#1e1e2e] bg-[#111118] flex items-center justify-center text-[#7c3aed] shadow-[0_0_0_1px_rgba(124,58,237,0.18)]">
              <Sparkles size={18} />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">
          Welcome Back
        </h2>

        {error ? (
          <motion.div
            key={error}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: [0, -10, 10, -8, 8, 0] }}
            transition={{ duration: 0.35 }}
            className="mb-4 text-[#ef4444] text-sm text-center bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl px-3 py-2"
            role="alert"
          >
            {error}
          </motion.div>
        ) : null}

        <div className="flex flex-col gap-4">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-[#64748b] text-sm mb-1">Email</label>
              <input
                type="email"
                className="w-full bg-[#0f172a] border border-[#1e1e2e] rounded-xl px-4 py-3 text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7]/60 focus-visible:border-[#a855f7] transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[#64748b] text-sm mb-1">Password</label>
              <input
                type="password"
                className="w-full bg-[#0f172a] border border-[#1e1e2e] rounded-xl px-4 py-3 text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7]/60 focus-visible:border-[#a855f7] transition duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="group mt-2 relative overflow-hidden bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#7c3aed] hover:to-[#a855f7] transition duration-200 px-5 py-3 rounded-xl font-semibold shadow-[0_0_0_1px_rgba(124,58,237,0.18)]"
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-200" />
              Sign In
            </button>
          </form>

          <div className="flex items-center gap-3 my-1">
            <div className="h-px bg-[#1e1e2e] flex-1" />
            <span className="text-xs text-[#64748b] font-medium">or continue with</span>
            <div className="h-px bg-[#1e1e2e] flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#111118]/30 hover:bg-[#111118]/60 hover:border-[#7c3aed]/40 transition duration-200 text-[#f1f5f9] text-sm"
            >
              GitHub
            </button>
            <button
              type="button"
              className="px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#111118]/30 hover:bg-[#111118]/60 hover:border-[#7c3aed]/40 transition duration-200 text-[#f1f5f9] text-sm"
            >
              Google
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-[#64748b]">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-[#a855f7] hover:text-[#f1f5f9] font-semibold transition duration-200"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
