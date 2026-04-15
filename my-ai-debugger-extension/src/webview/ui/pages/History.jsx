import { useEffect, useState } from 'react';
import API from '../services/api';
import { Trash2, Terminal, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await API.delete(`/history/${id}`);
      setHistory(history.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete record', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Debugging History</h2>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-[#1e293b] rounded-xl border border-slate-800 border-dashed">
          <Terminal size={48} className="mb-4 opacity-50" />
          <p className="text-lg">No debugging history found</p>
          <p className="text-sm mt-2 opacity-70">Analyze some code to see it here.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {history.map((record, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={record._id}
              className="bg-[#1e293b] border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row gap-6 hover:border-indigo-500/50 transition-colors group"
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-4">
                  <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-md text-sm font-semibold uppercase tracking-wider">
                    {record.language}
                  </span>
                  <span className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={14} />
                    {new Date(record.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="bg-[#0b1120] p-3 rounded-lg border border-slate-800">
                  <pre className="text-xs text-slate-400 line-clamp-3 font-mono">{record.code}</pre>
                </div>
              </div>

              <div className="w-full md:w-64 space-y-3 shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                <div>
                  <h4 className="text-sm text-slate-400 font-medium mb-1">Issues Found</h4>
                  <p className="text-xl font-bold text-red-400">{record.result?.bugs?.length || 0}</p>
                </div>

                <button
                  onClick={() => handleDelete(record._id)}
                  className="self-start md:self-end flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-2 rounded-lg transition text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

