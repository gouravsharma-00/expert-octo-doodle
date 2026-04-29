import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Clipboard, Info, Zap, Code as CodeIcon, Shield, Gauge, Lock } from 'lucide-react'
import { Editor } from '@monaco-editor/react'
import { useToast } from './ui/ToastProvider'
import { Skeleton } from './ui/Skeleton'

void motion

function defineMonacoTheme(monaco) {
  // Override the built-in vs-dark theme with our token palette.
  monaco.editor.defineTheme('vs-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '#a855f7' },
      { token: 'function', foreground: '#06b6d4' },
      { token: 'variable', foreground: '#f1f5f9' },
      { token: 'string', foreground: '#10b981' },
      { token: 'comment', foreground: '#64748b' },
      { token: 'number', foreground: '#f59e0b' },
    ],
    colors: {
      'editor.background': '#0a0a0f',
    },
  })
}

export default function BugPanel({ result, loading }) {
  const { pushToast } = useToast()
  const [activeTab, setActiveTab] = useState('bugs')
  const [openBugIdx, setOpenBugIdx] = useState(null)
  const [copied, setCopied] = useState(false)

  const bugs = result?.bugs || []
  const bugCount = bugs.length

  const activeSummary = useMemo(() => {
    if (!result) return null
    return {
      performance: result.performance || 'Looks good',
      security: result.security || 'No major issues detected',
      hasRefactored: Boolean(result.refactored_code),
    }
  }, [result])

  // UI state (open accordion, copied button) resets when `result` changes
  // via remounting from the parent component.

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col gap-5"
      >
        <div className="flex items-center justify-between gap-3">
          <Skeleton height={20} className="w-28" />
          <Skeleton height={28} className="w-16" />
        </div>

        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={110} className="w-full" />
          ))}
        </div>
      </motion.div>
    )
  }

  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.22 }}
        className="h-full flex flex-col items-center justify-center text-[#64748b] text-center px-6"
      >
        <Info className="mb-4 text-[#64748b]" size={42} />
        <h4 className="text-[#f1f5f9] font-semibold tracking-tight">
          No analysis results yet
        </h4>
        <p className="text-sm mt-2 leading-relaxed">
          Paste your code and click <span className="text-[#a855f7] font-semibold">Analyze</span> to
          see bug reports, performance insights, and a refactored version here.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#1e1e2e] bg-[#111118]/40 px-4 py-2">
          <Zap size={16} className="text-[#06b6d4]" />
          <span className="text-xs font-semibold">Tip: ensure language is correct</span>
        </div>
      </motion.div>
    )
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.refactored_code || '')
      setCopied(true)
      pushToast({
        type: 'success',
        title: 'Copied',
        message: 'Refactored code copied to clipboard.',
      })
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // Fallback for environments without clipboard permissions.
      pushToast({
        type: 'error',
        title: 'Copy failed',
        message: 'Failed to copy. Please copy manually.',
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-col gap-6"
    >
      {/* Tabs */}
      <div className="border-b border-[#1e1e2e] pb-3">
        <div className="flex items-end gap-2">
          <TabButton
            active={activeTab === 'bugs'}
            onClick={() => setActiveTab('bugs')}
            label="Bugs"
            badge={bugCount}
          />
          <TabButton
            active={activeTab === 'performance'}
            onClick={() => setActiveTab('performance')}
            label="Performance"
          />
          <TabButton
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
            label="Security"
          />
          <TabButton
            active={activeTab === 'refactored'}
            onClick={() => setActiveTab('refactored')}
            label="Refactored"
          />
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'bugs' && (
          <motion.div
            key="bugs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 text-[#f1f5f9]">
              <AlertTriangle size={18} className="text-[#ef4444]" />
              <h3 className="font-semibold tracking-tight">Bug Report</h3>
              <span className="ml-auto text-xs rounded-full border border-[#ef4444]/20 bg-[#ef4444]/10 text-[#ef4444] px-2 py-1 font-semibold">
                {bugCount} issue{bugCount === 1 ? '' : 's'}
              </span>
            </div>

            {bugs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {bugs.map((bug, idx) => {
                  const expanded = openBugIdx === idx
                  return (
                    <div
                      key={`${bug.issue}-${idx}`}
                      className="bg-[#111118]/30 border border-[#1e1e2e] rounded-xl overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenBugIdx((v) => (v === idx ? null : idx))}
                        className="w-full text-left px-4 py-4 flex items-start gap-3"
                      >
                        <div className="h-8 w-1.5 rounded-full bg-[#ef4444]/70 mt-1" />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-[#f1f5f9] truncate">
                              {bug.issue}
                            </h4>
                            {bug.line != null ? (
                              <span className="text-[11px] bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] px-2 py-0.5 rounded-full shrink-0">
                                Line {bug.line}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-sm text-[#64748b] mt-1 line-clamp-2">
                            {bug.explanation}
                          </p>
                        </div>

                        <div className="text-[#64748b] text-xs font-semibold">
                          {expanded ? 'Hide' : 'Expand'}
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 pb-4"
                          >
                            <div className="mt-2 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] p-3">
                              <div className="text-xs uppercase tracking-wide font-bold text-[#ef4444] mb-2">
                                Suggested Fix
                              </div>
                              <pre className="text-xs whitespace-pre-wrap text-[#f1f5f9] font-mono">
                                {bug.fix}
                              </pre>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl p-4 text-[#10b981] flex items-center gap-3">
                <Zap size={18} />
                <span className="font-semibold">No major bugs detected!</span>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'performance' && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 text-[#f1f5f9]">
              <Gauge size={18} className="text-[#f59e0b]" />
              <h3 className="font-semibold tracking-tight">Performance</h3>
            </div>
            <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-xl p-4">
              <p className="text-[#64748b] text-sm leading-relaxed">
                {activeSummary?.performance}
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 text-[#f1f5f9]">
              <Shield size={18} className="text-[#ef4444]" />
              <h3 className="font-semibold tracking-tight">Security</h3>
            </div>
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl p-4">
              <p className="text-[#64748b] text-sm leading-relaxed">
                {activeSummary?.security}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-[#64748b]">
                <Lock size={14} className="text-[#f59e0b]" />
                <span>Review potential risk and mitigations.</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'refactored' && (
          <motion.div
            key="refactored"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-semibold tracking-tight flex items-center gap-2 text-[#f1f5f9]">
                <CodeIcon size={18} className="text-[#7c3aed]" />
                Refactored Code
              </h3>

              <button
                type="button"
                onClick={copyToClipboard}
                disabled={!result.refactored_code}
                className="text-xs flex items-center gap-2 bg-[#111118]/50 hover:bg-[#111118]/70 disabled:opacity-50 disabled:cursor-not-allowed text-[#f1f5f9] border border-[#1e1e2e] px-3 py-2 rounded-lg transition duration-200"
              >
                <Clipboard size={14} />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {result.refactored_code ? (
              <div className="rounded-xl border border-[#1e1e2e] overflow-hidden bg-[#0a0a0f]">
                <Editor
                  height="360px"
                  defaultLanguage="javascript"
                  language="javascript"
                  theme="vs-dark"
                  value={result.refactored_code}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    renderLineHighlight: 'none',
                  }}
                  beforeMount={defineMonacoTheme}
                />
              </div>
            ) : (
              <div className="bg-[#111118]/30 border border-[#1e1e2e] rounded-xl p-4 text-[#64748b] text-sm">
                No refactored output provided for this analysis.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function TabButton({ active, onClick, label, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative px-3 py-2.5 text-sm font-semibold transition duration-200 rounded-xl ${
        active ? 'text-[#a855f7]' : 'text-[#64748b] hover:text-[#f1f5f9]'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="tracking-tight">{label}</span>
        {typeof badge === 'number' ? (
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border transition duration-200 ${
              active
                ? 'bg-[#ef4444]/10 border-[#ef4444]/25 text-[#ef4444]'
                : 'bg-[#111118]/30 border-[#1e1e2e] text-[#64748b]'
            }`}
          >
            {badge}
          </span>
        ) : null}
      </div>
      <motion.span
        className="absolute left-3 right-3 -bottom-[1px] h-0.5 rounded-full bg-[#7c3aed]"
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.18 }}
      />
    </button>
  )
}
