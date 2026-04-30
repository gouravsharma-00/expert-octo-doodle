import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import API from '../services/api'
import { useToast } from '../components/ui/ToastProvider'

void motion

function getPasswordStrength(pw) {
  const s = pw || ''
  const lengthScore = s.length >= 12 ? 2 : s.length >= 8 ? 1 : 0
  const varietyScore =
    (/[A-Z]/.test(s) ? 1 : 0) + (/[a-z]/.test(s) ? 1 : 0) + (/\d/.test(s) ? 1 : 0) + (/[^A-Za-z0-9]/.test(s) ? 1 : 0)
  const score = Math.min(4, lengthScore + Math.floor(varietyScore / 2))

  if (!s) return { score: 0, label: '—', color: '#64748b' }
  if (score <= 1) return { score, label: 'Weak', color: '#ef4444' }
  if (score === 2) return { score, label: 'Fair', color: '#f59e0b' }
  if (score === 3) return { score, label: 'Strong', color: '#06b6d4' }
  return { score, label: 'Very Strong', color: '#10b981' }
}

export default function Register() {
  const { pushToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const strength = getPasswordStrength(password)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await API.post('/auth/register', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('email', res.data.email)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      pushToast({
        type: 'error',
        title: 'Registration failed',
        message: err.response?.data?.message || 'Registration failed',
      })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f] text-[#f1f5f9] flex items-center justify-center p-6 font-sans">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(124,58,237,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.10)_1px,transparent_1px)] [background-size:48px_48px]" />
      <motion.div
        className="pointer-events-none absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-[#06b6d4]/10 blur-3xl"
        animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
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

          <div className="w-9 h-9 rounded-xl border border-[#1e1e2e] bg-[#111118] flex items-center justify-center text-[#7c3aed] shadow-[0_0_0_1px_rgba(124,58,237,0.18)]">
            <Sparkles size={18} />
          </div>
        </div>

        <h2 className="text-3xl font-bold tracking-tight mb-2 text-center">
          Create Account
        </h2>
        <p className="text-sm text-[#64748b] text-center mb-6">
          Start debugging with AI-powered insights.
        </p>

        {error ? (
          <motion.p
            key={error}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#ef4444] text-sm mb-4 text-center bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl px-3 py-2"
            role="alert"
          >
            {error}
          </motion.p>
        ) : null}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
              autoComplete="new-password"
            />

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-[#64748b] mb-2">
                <span>Password strength</span>
                <span className="font-semibold" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
              <div className="h-2 bg-[#1e1e2e] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#a855f7]"
                  animate={{ width: `${(strength.score / 4) * 100}%` }}
                  transition={{ duration: 0.2 }}
                  style={{ backgroundColor: strength.color }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="group relative overflow-hidden bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#7c3aed] hover:to-[#a855f7] transition duration-200 px-5 py-3 rounded-xl font-semibold shadow-[0_0_0_1px_rgba(124,58,237,0.18)] mt-2"
          >
            <motion.span
              className="absolute -left-28 top-0 h-full w-28 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.50),transparent)]"
              animate={{ x: ['-140%', '140%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="relative">Sign Up</span>
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
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

        <p className="mt-6 text-center text-sm text-[#64748b]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#a855f7] hover:text-[#f1f5f9] font-semibold transition duration-200 underline decoration-[#a855f7]/40 hover:decoration-[#a855f7]"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
