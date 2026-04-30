import { NavLink, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import {
  LayoutDashboard,
  Code,
  History as HistoryIcon,
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const userEmail = localStorage.getItem('email') || 'User'
  const userName = userEmail.split('@')[0]
  const initials = userName
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('')

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
    onMobileClose?.()
  }

  const navItems = useMemo(
    () => [
      {
        name: 'Dashboard',
        icon: <LayoutDashboard size={20} />,
        path: '/dashboard',
        end: true,
      },
      { name: 'Debug Code', icon: <Code size={20} />, path: '/debug', end: false },
      {
        name: 'History',
        icon: <HistoryIcon size={20} />,
        path: '/history',
        end: false,
      },
      {
        name: 'Settings',
        icon: <SettingsIcon size={20} />,
        path: '/settings',
        end: false,
      },
    ],
    []
  )

  const navLinkClass =
    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition duration-200 font-medium'

  const desktop = (
    <aside
      className={`h-screen flex flex-col border-r border-[#1e1e2e] bg-[#0a0a0f] flex-none transition-all duration-200 ${
        collapsed ? 'w-[64px]' : 'w-[240px]'
      }`}
    >
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl border border-[#1e1e2e] bg-[#111118] flex items-center justify-center text-[#7c3aed] shadow-[0_0_0_1px_rgba(124,58,237,0.18)]">
            <Sparkles size={18} />
          </div>
          {!collapsed && (
            <h1 className="text-sm md:text-base font-bold tracking-tight text-[#f1f5f9] truncate">
              AI Debugger
            </h1>
          )}
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="inline-flex items-center justify-center p-2 rounded-lg border border-[#1e1e2e] text-[#f1f5f9]/80 hover:text-[#f1f5f9] hover:border-[#7c3aed]/60 transition duration-200"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-2 pb-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            onClick={() => {
              // If sidebar is collapsed, keep behavior unchanged.
              // For mobile overlay close is handled by Layout.
            }}
            className={({ isActive }) =>
              `${navLinkClass} ${
                isActive
                  ? 'bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20 shadow-[0_0_0_1px_rgba(124,58,237,0.12)]'
                  : 'text-[#64748b] hover:text-[#f1f5f9] hover:bg-[#111118]/70 hover:border hover:border-[#1e1e2e]'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1e1e2e]">
        {!collapsed ? (
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition duration-200 font-medium text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 border border-transparent hover:border-[#ef4444]/20"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 rounded-xl transition duration-200 font-medium text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 border border-transparent hover:border-[#ef4444]/20"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        )}

        {/* User profile */}
        <div className={`mt-4 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full border border-[#1e1e2e] bg-[#111118] flex items-center justify-center text-sm font-bold text-[#7c3aed]">
            {initials || 'U'}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{userName}</div>
              <div className="text-xs text-[#64748b] truncate">{userEmail}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )

  const mobile = (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 md:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onMobileClose}
      />
      <aside
        className={`fixed left-0 top-0 z-50 h-screen md:hidden bg-[#0a0a0f] border-r border-[#1e1e2e] transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } w-[240px]`}
      >
        <div className="px-4 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl border border-[#1e1e2e] bg-[#111118] flex items-center justify-center text-[#7c3aed] shadow-[0_0_0_1px_rgba(124,58,237,0.18)]">
              <Sparkles size={18} />
            </div>
            <h1 className="text-sm md:text-base font-bold tracking-tight text-[#f1f5f9] truncate">
              AI Debugger
            </h1>
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            className="p-2 rounded-lg border border-[#1e1e2e] text-[#f1f5f9]/80 hover:text-[#f1f5f9] hover:border-[#7c3aed]/60 transition duration-200"
            aria-label="Close menu"
          >
            <span className="block w-2.5 h-2.5 border-t-2 border-r-2 border-[#f1f5f9]/70 rotate-45" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-2 px-2 pb-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `${navLinkClass} ${
                  isActive
                    ? 'bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20'
                    : 'text-[#64748b] hover:text-[#f1f5f9] hover:bg-[#111118]/70 hover:border hover:border-[#1e1e2e]'
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1e1e2e]">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition duration-200 font-medium text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 border border-transparent hover:border-[#ef4444]/20"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>

          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#1e1e2e] bg-[#111118] flex items-center justify-center text-sm font-bold text-[#7c3aed]">
              {initials || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{userName}</div>
              <div className="text-xs text-[#64748b] truncate">{userEmail}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )

  return (
    <>
      <div className="hidden md:block">{desktop}</div>
      {mobile}
    </>
  )
}
