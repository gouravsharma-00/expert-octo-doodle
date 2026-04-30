import { Editor } from '@monaco-editor/react';

function defineMonacoTheme(monaco) {
  monaco.editor.defineTheme('vs-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '#a855f7' },
      { token: 'function', foreground: '#06b6d4' },
      { token: 'variable', foreground: '#f1f5f9' },
      { token: 'string', foreground: '#10b981' },
      { token: 'comment', foreground: '#64748b' },
      { token: 'number', foreground: '#f59e0b' },
    ],
    colors: {
      'editor.background': '#0a0a0f',
    },
  })
}

export default function CodeEditorComponent({ code, onChange, language }) {
  const handleEditorChange = (value) => {
    onChange(value || "");
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={handleEditorChange}
      beforeMount={defineMonacoTheme}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        padding: { top: 16 },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
      }}
    />
  );
}
