import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-200 border-b border-slate-700 pb-2">Account</h3>
        <p className="text-slate-400 text-sm mb-4">You are currently logged in.</p>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition px-5 py-2.5 rounded-xl font-medium"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-200 border-b border-slate-700 pb-2">Editor Preferences</h3>
        <p className="text-slate-400 text-sm">Theme is locked to modern Dark Mode for consistency.</p>
        <p className="text-slate-400 text-sm mt-2">More settings coming soon!</p>
      </div>
    </div>
  );
}
