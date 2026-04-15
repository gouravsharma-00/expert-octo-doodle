import { useState } from 'react';
import API from '../services/api';

export default function NLDebug() {
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!description.trim()) {
      setError('Please provide a description of the issue.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await API.post('/nl-debug', { description, code, language });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to analyze code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">NL to Code Debugger</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Describe Issue</h2>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">What is the problem?</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., My function is returning undefined when it should return an array."
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="block text-sm font-medium text-slate-400">Code Context (Optional)</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="typescript">TypeScript</option>
              </select>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              placeholder="Paste code context here"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Analyze Problem'}
          </button>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-white mb-4">Analysis Result</h2>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <p>AI is thinking...</p>
            </div>
          ) : result ? (
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <h3 className="text-sm font-medium text-indigo-400 mb-2 uppercase tracking-wider">Problem Detected</h3>
                <p className="text-slate-200">{result.problem}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <h3 className="text-sm font-medium text-indigo-400 mb-2 uppercase tracking-wider">Explanation</h3>
                <pre className="text-slate-200 whitespace-pre-wrap">{result.explanation}</pre>
              </div>
              {result.fixedCode && (
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-sm font-medium text-emerald-400 mb-2 uppercase tracking-wider">Fixed Code</h3>
                  <pre className="text-slate-200 whitespace-pre-wrap font-mono text-sm">{result.fixedCode}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center">
              <p>Provide a description and code context on the left to get AI assistance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

