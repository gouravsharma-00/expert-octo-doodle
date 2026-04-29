import { useMemo, useState } from 'react'
import { CheckCircle2, LogOut, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

void motion

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full border transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7]/60 focus-visible:border-[#a855f7] ${
        checked ? 'bg-[#7c3aed]/20 border-[#7c3aed]/40' : 'bg-[#111118]/40 border-[#1e1e2e]'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full transition duration-200 transform ${
          checked ? 'translate-x-6 bg-[#a855f7]' : 'translate-x-1 bg-[#64748b]'
        }`}
      />
      <span className="sr-only">{label}</span>
    </button>
  )
}

export default function Settings() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const userEmail = localStorage.getItem('email') || 'User'
  const userName = userEmail.split('@')[0]

  const [notifyEmail, setNotifyEmail] = useState(true)
  const [autoAnalyze, setAutoAnalyze] = useState(false)
  const [rememberEditor, setRememberEditor] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const saveDisabled = saving

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    // UI-only: no backend settings endpoints in this repo.
    window.setTimeout(() => {
      setSaving(false)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 1400)
    }, 900)
  }

  const checkIcon = useMemo(() => {
    if (!saved) return null
    return (
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="inline-flex items-center justify-center"
      >
        <CheckCircle2 size={18} />
      </motion.span>
    )
  }, [saved])

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-sm text-[#64748b] mt-1">Manage your preferences.</p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saveDisabled}
          className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-[#7c3aed] hover:bg-[#a855f7] transition duration-200 shadow-[0_0_0_1px_rgba(124,58,237,0.18)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
          {checkIcon}
        </button>
      </div>

      {/* Profile */}
      <section className="bg-[#111118]/30 border border-[#1e1e2e] rounded-2xl p-6 mb-6">
        <SectionLabel label="Profile" />
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-[#64748b]">Signed in as</div>
            <div className="text-lg font-semibold tracking-tight mt-1">{userName}</div>
            <div className="text-sm text-[#64748b] mt-1 break-words">{userEmail}</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-[#ef4444]/10 hover:bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/20 transition duration-200"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </section>

      {/* Security */}
      <section className="bg-[#111118]/30 border border-[#1e1e2e] rounded-2xl p-6 mb-6">
        <SectionLabel label="Security" />

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold tracking-tight">Account notifications</div>
            <div className="text-sm text-[#64748b] mt-1">
              Receive security alerts via email.
            </div>
          </div>
          <Toggle
            checked={notifyEmail}
            onChange={setNotifyEmail}
            label="Account notifications"
          />
        </div>

        <div className="mt-6 rounded-2xl border border-[#ef4444]/20 bg-[#ef4444]/5 p-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center text-[#ef4444]">
              <Trash2 size={18} />
            </div>
            <div>
              <div className="font-semibold tracking-tight text-[#ef4444]">Danger zone</div>
              <div className="text-sm text-[#64748b] mt-1">
                Account deletion is disabled in this demo (no backend endpoint).
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="mt-4 w-full px-4 py-2.5 rounded-xl font-semibold bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 disabled:opacity-60 disabled:cursor-not-allowed transition duration-200"
          >
            Delete Account
          </button>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-[#111118]/30 border border-[#1e1e2e] rounded-2xl p-6">
        <SectionLabel label="Preferences" />

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold tracking-tight">Auto-analyze on edit</div>
              <div className="text-sm text-[#64748b] mt-1">
                Run analysis automatically when code changes.
              </div>
            </div>
            <Toggle checked={autoAnalyze} onChange={setAutoAnalyze} label="Auto-analyze on edit" />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold tracking-tight">Remember editor content</div>
              <div className="text-sm text-[#64748b] mt-1">
                Keep your last snippet when switching languages.
              </div>
            </div>
            <Toggle
              checked={rememberEditor}
              onChange={setRememberEditor}
              label="Remember editor content"
            />
          </div>
        </div>

        <p className="text-sm text-[#64748b] mt-5">
          More settings coming soon. Your current UI theme is locked to dark for consistency.
        </p>
      </section>
    </div>
  )
}

function SectionLabel({ label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-2.5 h-2.5 rounded-full bg-[#a855f7] shadow-[0_0_0_1px_rgba(124,58,237,0.18)]" />
      <h3 className="text-lg font-semibold tracking-tight">{label}</h3>
      <div className="flex-1 h-px bg-[#1e1e2e]" />
    </div>
  )
}
