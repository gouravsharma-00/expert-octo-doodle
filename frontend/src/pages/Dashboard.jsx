import { useEffect, useMemo, useState } from 'react'
import { Activity, Bug, Code, Clock, Terminal, ArrowRight } from 'lucide-react'
import API from '../services/api'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Skeleton } from '../components/ui/Skeleton'

void motion

export default function Dashboard() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const userEmail = localStorage.getItem('email') || 'User'
  const username = userEmail.split('@')[0]

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await API.get('/history')
      setHistory(res.data)
    } catch (err) {
      console.error('Failed to fetch history', err)
    } finally {
      setLoading(false)
    }
  }

  const metrics = useMemo(() => {
    const totalSessions = history.length
    const bugsFound = history.reduce(
      (sum, record) => sum + (record.result?.bugs?.length || 0),
      0
    )
    const languagesUsed = new Set(history.map((r) => r.language)).size

    const now = Date.now()
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000
    const thisWeek = history.filter((r) => new Date(r.createdAt).getTime() >= weekAgo)
      .length

    const lastDebugTime =
      history.length > 0
        ? new Date(history[0].createdAt).toLocaleString()
        : 'No activity yet'

    return { totalSessions, bugsFound, languagesUsed, thisWeek, lastDebugTime }
  }, [history])

  const avatarInitials = useMemo(() => {
    const parts = username.split(/[\s._-]+/).filter(Boolean)
    return parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('')
  }, [username])

  if (loading) {
    return (
      <div className="relative flex flex-col h-full overflow-hidden pr-2 gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Skeleton height={48} className="w-12" />
            <div className="flex-1">
              <Skeleton height={24} className="w-56 mb-3" />
              <Skeleton height={16} className="w-64" />
            </div>
          </div>
          <Skeleton height={40} className="w-36" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={132} className="w-full" />
          ))}
        </div>

        <Skeleton height={340} className="w-full" />
      </div>
    )
  }

  return (
    <div className="relative flex flex-col h-full overflow-y-auto pr-2">
      {/* Subtle animated grid background */}
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(124,58,237,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.10)_1px,transparent_1px)] [background-size:56px_56px]">
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundPosition: ['0px 0px', '56px 56px'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative flex flex-col h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-full border border-[#1e1e2e] bg-[#111118] flex items-center justify-center text-sm font-bold text-[#7c3aed] shadow-[0_0_0_1px_rgba(124,58,237,0.12)]">
              {avatarInitials || 'U'}
            </div>
            <div className="min-w-0">
              <h2 className="text-3xl font-bold tracking-tight inline-block">
                <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                  Hello, {username}!
                </span>
              </h2>
              <p className="text-[#64748b] mt-1">
                Welcome to your AI debugging workspace.
              </p>
            </div>
          </div>

          <Link
            to="/debug"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#a855f7] hover:bg-[#7c3aed]/15 transition duration-200"
          >
            Start Debugging →
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            accentClass="border-t-2 border-[#7c3aed]/70"
            iconBg="bg-[#7c3aed]/15 text-[#a855f7]"
            icon={<Activity size={22} />}
            label="Total Debugs"
            value={metrics.totalSessions}
          />
          <StatCard
            accentClass="border-t-2 border-[#ef4444]/70"
            iconBg="bg-[#ef4444]/15 text-[#ef4444]"
            icon={<Bug size={22} />}
            label="Bugs Found"
            value={metrics.bugsFound}
          />
          <StatCard
            accentClass="border-t-2 border-[#06b6d4]/70"
            iconBg="bg-[#06b6d4]/15 text-[#06b6d4]"
            icon={<Code size={22} />}
            label="Languages Used"
            value={metrics.languagesUsed}
          />

          <StatCard
            accentClass="border-t-2 border-[#f59e0b]/70"
            iconBg="bg-[#f59e0b]/15 text-[#f59e0b]"
            icon={<Clock size={22} />}
            label="This Week"
            value={metrics.thisWeek}
          />
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex justify-between items-center mb-4 border-b border-[#1e1e2e] pb-2">
            <h3 className="text-xl font-bold text-[#f1f5f9]">Recent Activity</h3>
            <Link
              to="/history"
              className="text-sm text-[#7c3aed] hover:text-[#a855f7] font-medium transition duration-200"
            >
              View All History →
            </Link>
          </div>

          {history.length === 0 ? (
            <div className="bg-[#111118]/40 rounded-2xl border border-[#1e1e2e] p-8 text-center flex flex-col items-center">
              <Terminal size={40} className="text-[#64748b] mb-3" />
              <p className="text-[#64748b]">You haven't run any debug sessions yet.</p>
              <Link
                to="/debug"
                className="mt-4 bg-[#7c3aed] hover:bg-[#a855f7] transition duration-200 px-5 py-2 rounded-xl text-sm font-semibold shadow-[0_0_0_1px_rgba(124,58,237,0.18)]"
              >
                Start Debugging
              </Link>
            </div>
          ) : (
            <div className="bg-[#111118]/30 rounded-2xl border border-[#1e1e2e] overflow-hidden">
              {history.slice(0, 5).map((record, index) => (
                <motion.div
                  key={record._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: index * 0.04 }}
                  className={`p-4 flex items-center justify-between ${
                    index !== 0 ? 'border-t border-[#1e1e2e]' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-[#0a0a0f] w-10 h-10 rounded-lg flex items-center justify-center border border-[#1e1e2e] font-mono text-xs font-bold text-[#a855f7] uppercase shrink-0">
                      {record.language.substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#f1f5f9] line-clamp-1">
                        {record.code.substring(0, 40)}...
                      </p>
                      <p className="text-xs text-[#64748b] mt-1">
                        {new Date(record.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold bg-[#ef4444]/10 text-[#ef4444] px-2.5 py-1 rounded-full border border-[#ef4444]/20">
                      {record.result?.bugs?.length || 0} issues
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ iconBg, icon, label, value, accentClass, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={`bg-[#111118]/40 border border-[#1e1e2e] rounded-2xl p-6 shadow-[0_0_0_1px_rgba(124,58,237,0.08)] ${accentClass} ${className}`}
    >
      <div className={`p-4 rounded-xl ${iconBg}`}>{icon}</div>
      <div className="mt-3">
        <p className="text-[#64748b] text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-[#f1f5f9] mt-1">{value}</p>
      </div>
    </motion.div>
  )
}
