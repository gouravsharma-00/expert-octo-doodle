import { useEffect, useState } from 'react';
import { Activity, Bug, Clock, Terminal } from 'lucide-react';
import API from '../services/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem('email') || 'User';
  const username = userEmail.split('@')[0];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/history');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const totalSessions = history.length;
  const bugsFixed = history.reduce((sum, record) => sum + (record.result?.bugs?.length || 0), 0);
  const lastDebugTime = history.length > 0 ? new Date(history[0].createdAt).toLocaleString() : 'No activity yet';

  return (
    <div className="flex flex-col h-full overflow-y-auto pr-2">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent inline-block">
          Hello, {username}!
        </h2>
        <p className="text-slate-400 mt-2">Welcome to your AI debugging workspace.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center gap-4"
        >
          <div className="bg-indigo-500/20 p-4 rounded-xl text-indigo-400">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Debug Sessions</p>
            <p className="text-2xl font-bold text-white mt-1">{totalSessions}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center gap-4"
        >
          <div className="bg-green-500/20 p-4 rounded-xl text-green-400">
            <Bug size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Bugs Detected</p>
            <p className="text-2xl font-bold text-white mt-1">{bugsFixed}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center gap-4"
        >
          <div className="bg-purple-500/20 p-4 rounded-xl text-purple-400">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Last Debug Time</p>
            <p className="text-sm font-bold text-white mt-1">{lastDebugTime}</p>
          </div>
        </motion.div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
          <h3 className="text-xl font-bold text-slate-200">Recent Activity</h3>
          <Link to="/history" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
            View All History →
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center flex flex-col items-center">
            <Terminal size={40} className="text-slate-500 mb-3" />
            <p className="text-slate-400">You haven't run any debug sessions yet.</p>
            <Link
              to="/debug"
              className="mt-4 bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-xl text-sm font-semibold transition"
            >
              Start Debugging
            </Link>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            {history.slice(0, 5).map((record, index) => (
              <div
                key={record._id}
                className={`p-4 flex items-center justify-between ${index !== 0 ? 'border-t border-slate-700' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-slate-900 w-10 h-10 rounded-lg flex items-center justify-center border border-slate-700 font-mono text-xs font-bold text-indigo-400 uppercase">
                    {record.language.substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-200 line-clamp-1">{record.code.substring(0, 40)}...</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(record.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full border border-red-500/20">
                    {record.result?.bugs?.length || 0} issues
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

