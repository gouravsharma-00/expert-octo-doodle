import { AlertTriangle, Info, Zap, Code, Clipboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BugPanel({ result, loading }) {
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        <p>AI is analyzing your code...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center px-6">
        <Info className="mb-4 text-slate-600" size={40} />
        <p>Paste your code and click "Analyze" to see intelligent bug reports and fixes here.</p>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.refactored_code || '');
    alert('Code copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h3 className="text-xl font-bold border-b border-slate-700 pb-2 mb-4">Analysis Report</h3>
        {result.bugs && result.bugs.length > 0 ? (
          result.bugs.map((bug, index) => (
            <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-400 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-red-300">
                    {bug.issue}
                    {bug.line && <span className="ml-2 text-xs bg-red-500/20 px-2 py-0.5 rounded-full">Line {bug.line}</span>}
                  </h4>
                  <p className="text-slate-300 text-sm mt-1">{bug.explanation}</p>
                  <div className="mt-3 bg-[#0b1120] p-3 rounded-lg text-sm border border-slate-800">
                    <span className="text-green-400 block mb-1 text-xs uppercase font-bold tracking-wider">Suggested Fix</span>
                    <code className="text-green-300">{bug.fix}</code>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400 flex items-center gap-3">
            <Zap size={20} />
            <span className="font-medium">No major bugs detected!</span>
          </div>
        )}
      </div>

      <div>
        <h4 className="font-bold border-b border-slate-700 pb-2 mb-3 mt-4 text-slate-200">Security & Performance</h4>
        <div className="space-y-3 text-sm">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <span className="text-yellow-400 font-semibold block mb-1">Performance</span>
            <p className="text-slate-300">{result.performance || 'Looks good'}</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <span className="text-blue-400 font-semibold block mb-1">Security</span>
            <p className="text-slate-300">{result.security || 'No major issues detected'}</p>
          </div>
        </div>
      </div>

      {result.refactored_code && (
        <div className="mt-4">
          <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
            <h4 className="font-bold flex items-center gap-2 text-slate-200">
              <Code size={18} /> Optimized Code
            </h4>
            <button
              onClick={copyToClipboard}
              className="text-xs flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition"
            >
              <Clipboard size={14} /> Copy
            </button>
          </div>
          <pre className="text-xs bg-[#0b1120] p-4 rounded-xl border border-slate-800 overflow-x-auto text-slate-300 font-mono">
            {result.refactored_code}
          </pre>
        </div>
      )}
    </motion.div>
  );
}
