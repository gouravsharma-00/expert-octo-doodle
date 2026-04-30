import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Code2, Loader2, ShieldCheck, TerminalSquare } from 'lucide-react'
import CodeEditorComponent from '../components/CodeEditor'
import BugPanel from '../components/BugPanel'
import API from '../services/api'
import { useToast } from '../components/ui/ToastProvider'

void motion

const languageMeta = {
  javascript: { label: 'JavaScript', badge: 'JS', icon: <Code2 size={14} /> },
  python: { label: 'Python', badge: 'PY', icon: <TerminalSquare size={14} /> },
  java: { label: 'Java', badge: 'JV', icon: <ShieldCheck size={14} /> },
  cpp: { label: 'C++', badge: 'C++', icon: <Code2 size={14} /> },
  cs: { label: 'C#', badge: 'C#', icon: <ShieldCheck size={14} /> },
}

export default function DebugCode() {
  const { pushToast } = useToast()
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mobileTab, setMobileTab] = useState('code')
  const [langOpen, setLangOpen] = useState(false)

  const lineCount = useMemo(() => {
    const trimmed = code.replace(/\r\n/g, '\n')
    if (!trimmed.trim()) return 0
    return trimmed.split('\n').length
  }, [code])

  const handleAnalyze = async () => {
    try {
      setLoading(true)
      const res = await API.post('/debug/analyze', { code, language })
      setAnalysisResult(res.data)
      setMobileTab('results')
    } catch (err) {
      console.error(err)
      pushToast({
        type: 'error',
        title: 'Analyze failed',
        message: err.response?.data?.message || 'Failed to analyze code',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Page title + toolbar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight">Debug Code</h2>
          <p className="text-sm text-[#64748b] mt-1">
            Paste code, pick a language, and run analysis.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LineBadge count={lineCount} />
          <LanguageSelect
            language={language}
            open={langOpen}
            onOpenChange={setLangOpen}
            onChange={setLanguage}
          />
          <AnalyzeButton loading={loading} disabled={loading || !code.trim()} onClick={handleAnalyze} />
        </div>
      </div>

      {/* Mobile toolbar */}
      <div className="md:hidden flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between gap-3">
          <LineBadge count={lineCount} />
          <LanguageSelect
            language={language}
            open={langOpen}
            onOpenChange={setLangOpen}
            onChange={setLanguage}
          />
        </div>
        <AnalyzeButton loading={loading} disabled={loading || !code.trim()} onClick={handleAnalyze} />

        <div className="flex gap-2 rounded-xl bg-[#111118]/30 border border-[#1e1e2e] p-1">
          <button
            type="button"
            onClick={() => setMobileTab('code')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
              mobileTab === 'code'
                ? 'bg-[#7c3aed]/15 text-[#a855f7] border border-[#7c3aed]/20'
                : 'text-[#64748b] hover:text-[#f1f5f9]'
            }`}
          >
            Code
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('results')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
              mobileTab === 'results'
                ? 'bg-[#7c3aed]/15 text-[#a855f7] border border-[#7c3aed]/20'
                : 'text-[#64748b] hover:text-[#f1f5f9]'
            }`}
          >
            Results
          </button>
        </div>
      </div>

      {/* Split pane */}
      <div className="flex-1 flex gap-6 overflow-hidden relative">
        <div
          className={`flex-1 rounded-xl overflow-hidden border border-[#1e1e2e] shadow-[0_0_0_1px_rgba(124,58,237,0.08)] bg-[#111118]/20 ${
            mobileTab === 'code' ? 'block' : 'hidden md:block'
          }`}
        >
          <CodeEditorComponent
            code={code}
            onChange={setCode}
            language={language}
          />
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.22 }}
          className={`w-[450px] overflow-y-auto bg-[#111118]/35 rounded-xl border border-[#1e1e2e] p-6 shadow-[0_0_0_1px_rgba(124,58,237,0.08)] ${
            mobileTab === 'results' ? 'block' : 'hidden md:block'
          }`}
        >
          <BugPanel
            key={analysisResult?.refactored_code ? analysisResult.refactored_code.slice(0, 24) : 'no-analysis'}
            result={analysisResult}
            loading={loading}
          />
        </motion.aside>
      </div>
    </div>
  )
}

function LineBadge({ count }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[#1e1e2e] bg-[#111118]/30">
      <span className="text-xs text-[#64748b]">Lines</span>
      <span className="text-sm font-bold text-[#a855f7]">{count}</span>
    </div>
  )
}

function LanguageSelect({ language, open, onOpenChange, onChange }) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[#1e1e2e] bg-[#111118]/30 hover:bg-[#111118]/50 transition duration-200 text-sm min-w-[190px] justify-between"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] flex items-center justify-center text-[#a855f7] font-bold text-[10px] shrink-0">
            {languageMeta[language].badge}
          </span>
          <span className="text-sm font-semibold truncate">{languageMeta[language].label}</span>
        </div>
        <ChevronDown size={16} className="text-[#64748b]" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute mt-2 left-0 right-0 bg-[#111118] border border-[#1e1e2e] rounded-xl shadow-[0_0_0_1px_rgba(124,58,237,0.10)] overflow-hidden z-20"
        >
          {Object.entries(languageMeta).map(([id, meta]) => (
            <button
              type="button"
              key={id}
              onClick={() => {
                onChange(id)
                onOpenChange(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition duration-200 ${
                id === language
                  ? 'bg-[#7c3aed]/15 text-[#a855f7]'
                  : 'text-[#64748b] hover:bg-[#111118]/60 hover:text-[#f1f5f9]'
              }`}
            >
              <span className="w-7 h-7 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] flex items-center justify-center text-[#a855f7] font-bold text-[10px] shrink-0">
                {meta.badge}
              </span>
              <span className="font-semibold flex-1 text-left truncate">{meta.label}</span>
              <span className="text-[#64748b]">{meta.icon}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function AnalyzeButton({ loading, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative overflow-hidden bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#7c3aed] hover:to-[#a855f7] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-[0_0_0_1px_rgba(124,58,237,0.18)] inline-flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <motion.span
            className="absolute inset-0 opacity-0"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
          <Loader2 size={18} className="animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <span>Analyze</span>
        </>
      )}
    </button>
  )
}
