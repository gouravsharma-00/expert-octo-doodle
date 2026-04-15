import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Code, History as HistoryIcon, Settings as SettingsIcon, LogOut, MessageCircle } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', end: true },
    { name: 'Debug Code', icon: <Code size={20} />, path: '/debug', end: false },
    { name: 'NL Debug', icon: <MessageCircle size={20} />, path: '/nl-debug', end: false },
    { name: 'History', icon: <HistoryIcon size={20} />, path: '/history', end: false },
    { name: 'Settings', icon: <SettingsIcon size={20} />, path: '/settings', end: false }
  ];

  return (
    <div className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col pt-6">
      <div className="px-6 mb-10">
        <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          AI Debugger
        </h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}

