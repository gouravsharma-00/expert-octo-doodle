import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex bg-slate-900 text-white min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

