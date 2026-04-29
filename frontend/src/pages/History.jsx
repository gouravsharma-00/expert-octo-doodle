import { useEffect, useMemo, useState } from 'react'
import API from '../services/api'
import { Trash2, Terminal, Calendar, Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useToast } from '../components/ui/ToastProvider'
import { Skeleton } from '../components/ui/Skeleton'

void motion

function languageBadgeStyle(language) {
  switch (language) {
    case 'javascript':
      return 'bg-[#f59e0b]/10 border-[#f59e0b]/20 text-[#f59e0b]'
    case 'python':
      return 'bg-[#06b6d4]/10 border-[#06b6d4]/20 text-[#06b6d4]'
    case 'java':
      return 'bg-[#7c3aed]/10 border-[#7c3aed]/20 text-[#a855f7]'
    case 'cpp':
      return 'bg-[#06b6d4]/10 border-[#06b6d4]/20 text-[#06b6d4]'
    case 'cs':
      return 'bg-[#ef4444]/10 border-[#ef4444]/20 text-[#ef4444]'
    default:
      return 'bg-[#7c3aed]/10 border-[#7c3aed]/20 text-[#a855f7]'
  }
}

export default function History() {
  const { pushToast } = useToast()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 6

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

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return
    try {
      await API.delete(`/history/${id}`)
      setHistory((prev) => prev.filter((item) => item._id !== id))
      pushToast({
        type: 'success',
        title: 'Deleted',
        message: 'History record removed.',
      })
    } catch (err) {
      console.error('Failed to delete record', err)
      pushToast({
        type: 'error',
        title: 'Delete failed',
        message: err.response?.data?.message || 'Failed to delete record.',
      })
    }
  }

  const languageOptions = useMemo(() => {
    return Array.from(new Set(history.map((r) => r.language))).sort()
  }, [history])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const byLang = language === 'all' ? history : history.filter((r) => r.language === language)

    const byQuery = !q
      ? byLang
      : byLang.filter((r) => {
          const code = String(r.code || '').toLowerCase()
          const lang = String(r.language || '').toLowerCase()
          return code.includes(q) || lang.includes(q)
        })

    return byQuery.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [history, language, search])

  useEffect(() => {
    setPage(1)
  }, [language, search])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  if (loading) {
    return (
      <div className="h-full flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Skeleton height={28} className="w-52" />
            <div className="mt-3">
              <Skeleton height={16} className="w-72" />
            </div>
          </div>
          <Skeleton height={36} className="w-36 hidden sm:block" />
        </div>

        <div className="bg-[#111118]/30 border border-[#1e1e2e] rounded-2xl p-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <Skeleton height={40} className="w-full md:flex-1" />
            <Skeleton height={40} className="w-full md:w-60" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} height={220} className="w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Debugging History</h2>
          <p className="text-sm text-[#64748b] mt-1">
            Search sessions, filter by language, and revisit past analysis.
          </p>
        </div>

        <Link
          to="/debug"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#a855f7] hover:bg-[#7c3aed]/15 transition duration-200"
        >
          New Debug →
        </Link>
      </div>

      {/* Search + filter */}
      <div className="bg-[#111118]/30 border border-[#1e1e2e] rounded-2xl p-4 mb-5">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-[#64748b]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by language or code snippet..."
              className="w-full bg-transparent outline-none text-[#f1f5f9] placeholder:text-[#64748b] focus:ring-0"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#64748b]" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#0a0a0f] border border-[#1e1e2e] text-[#f1f5f9] text-sm rounded-xl px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7]/60 focus-visible:border-[#a855f7] transition duration-200"
            >
              <option value="all">All languages</option>
              {languageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-[#64748b] bg-[#111118]/30 rounded-2xl border border-[#1e1e2e] border-dashed">
          <Terminal size={52} className="mb-4 opacity-70" />
          <p className="text-lg text-[#f1f5f9] font-semibold">No debugging history found</p>
          <p className="text-sm mt-2 text-[#64748b]">Analyze some code to see it here.</p>
          <Link
            to="/debug"
            className="mt-5 bg-[#7c3aed] hover:bg-[#a855f7] transition duration-200 px-5 py-2 rounded-xl text-sm font-semibold shadow-[0_0_0_1px_rgba(124,58,237,0.18)]"
          >
            Start Debugging
          </Link>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {paged.length === 0 ? (
            <div className="text-center text-[#64748b] py-10">
              No sessions match your filters.
            </div>
          ) : (
            paged.map((record) => {
              const bugCount = record.result?.bugs?.length || 0
              return (
                <motion.div
                  key={record._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative group bg-[#111118]/40 border border-[#1e1e2e] rounded-2xl p-5 hover:border-[#7c3aed]/60 hover:shadow-[0_0_0_1px_rgba(124,58,237,0.12)] transition duration-200 transform hover:-translate-y-1"
                >
                  <button
                    type="button"
                    onClick={() => handleDelete(record._id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition duration-200 bg-[#ef4444]/10 hover:bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/20 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
                    aria-label="Delete history item"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`shrink-0 px-3 py-1 rounded-lg border text-xs font-semibold uppercase tracking-wider ${languageBadgeStyle(
                          record.language
                        )}`}
                      >
                        {record.language}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-[#64748b]">
                          <Calendar size={14} />
                          <span className="truncate">
                            {new Date(record.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs font-semibold bg-[#ef4444]/10 text-[#ef4444] px-2.5 py-1 rounded-full border border-[#ef4444]/20">
                            {bugCount} bugs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-3">
                    <pre className="text-xs text-[#64748b] line-clamp-3 font-mono whitespace-pre-wrap overflow-hidden">
                      {record.code}
                    </pre>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      )}

      {/* Pagination */}
      {history.length > 0 && (
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#111118]/30 border border-[#1e1e2e] text-[#64748b] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            Prev
          </button>

          <div className="text-sm text-[#64748b]">
            Page <span className="text-[#f1f5f9] font-semibold">{page}</span> of{' '}
            <span className="text-[#f1f5f9] font-semibold">{pageCount}</span>
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page >= pageCount}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#111118]/30 border border-[#1e1e2e] text-[#64748b] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
