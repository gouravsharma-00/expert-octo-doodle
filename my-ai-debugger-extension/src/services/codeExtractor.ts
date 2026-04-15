import * as vscode from 'vscode';

export function getActiveFileText(): { code: string; language: string } {
  const editor = vscode.window.activeTextEditor;
  if (!editor) throw new Error('No active editor');
  const doc = editor.document;
  return { code: doc.getText(), language: doc.languageId };
}

export function getSelectedTextOrThrow(): { code: string; language: string } {
  const editor = vscode.window.activeTextEditor;
  if (!editor) throw new Error('No active editor');
  const doc = editor.document;
  const sel = editor.selection;
  const code = doc.getText(sel);
  if (!code?.trim()) throw new Error('No selection');
  return { code, language: doc.languageId };
}

