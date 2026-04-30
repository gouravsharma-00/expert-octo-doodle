import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Layout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-[#0a0a0f] text-[#f1f5f9]">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg border border-[#1e1e2e] text-[#f1f5f9]/90 hover:text-[#f1f5f9] hover:border-[#7c3aed]/60 transition duration-200"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-semibold tracking-tight text-[#f1f5f9]">
            AI Debugger
          </span>
        </div>

        {/* Main content with subtle grid */}
        <div className="relative flex-1 overflow-y-auto p-6 md:p-8">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(124,58,237,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.06)_1px,transparent_1px)] [background-size:48px_48px] dark" />

          <div className="relative h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
