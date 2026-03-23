import { Editor } from '@monaco-editor/react';

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
