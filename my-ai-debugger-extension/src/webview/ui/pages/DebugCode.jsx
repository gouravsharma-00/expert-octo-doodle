import { useState } from 'react';
import API from '../services/api';

export default function DebugCode() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      const res = await API.post('/debug/analyze', { code, language });
      setAnalysisResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to analyze code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Debug Code</h2>
        <div className="flex gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#1e293b] border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="cs">C#</option>
          </select>
          <button
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition px-6 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/20"
          >
            {loading ? 'Analyzing...' : 'Analyze Code'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        <div className="flex-1 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[60vh] bg-[#0b1120] text-slate-200 font-mono p-4 outline-none"
            placeholder="Paste code here (the in-editor selection commands also work)"
          />
        </div>

        <div className="w-[450px] overflow-y-auto bg-[#1e293b] rounded-xl border border-slate-800 p-6 shadow-xl">
          <pre className="text-xs whitespace-pre-wrap text-slate-200">
            {analysisResult ? JSON.stringify(analysisResult, null, 2) : 'No results yet.'}
          </pre>
        </div>
      </div>
    </>
  );
}

