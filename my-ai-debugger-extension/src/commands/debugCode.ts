import * as vscode from 'vscode';
import { DebugPanelProvider } from '../providers/DebugPanelProvider';
import { analyzeCodeWithAi } from '../services/aiService';
import { getActiveFileText, getSelectedTextOrThrow } from '../services/codeExtractor';
import { verifyToken } from '../services/authService';
import { saveHistoryRecord } from '../services/historyService';

async function getTokenFromSecretsOrPrompt(context: vscode.ExtensionContext): Promise<string | undefined> {
  // Webview flow uses its own storage; command flow needs a token too.
  // We store last token in secrets so commands can run without opening the UI.
  const token = await context.secrets.get('authToken');
  return token ?? undefined;
}

export async function debugSelectionCommand(
  context: vscode.ExtensionContext,
  debugPanel: DebugPanelProvider
): Promise<void> {
  try {
    const { code, language } = getSelectedTextOrThrow();
    const token = await getTokenFromSecretsOrPrompt(context);
    if (!token) {
      vscode.window.showWarningMessage('AI Debugger: Please log in from the panel first (AI Debugger: Open Panel).');
      debugPanel.open();
      return;
    }
    const { id: userId } = await verifyToken(context, token);
    const result = await analyzeCodeWithAi(context, code, language);
    await saveHistoryRecord(context, userId, code, language || 'plaintext', result);
    debugPanel.open();
    debugPanel.postMessage({ command: 'debugResult', data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(`AI Debugger: ${msg}`);
  }
}

export async function debugFileCommand(
  context: vscode.ExtensionContext,
  debugPanel: DebugPanelProvider
): Promise<void> {
  try {
    const { code, language } = getActiveFileText();
    const token = await getTokenFromSecretsOrPrompt(context);
    if (!token) {
      vscode.window.showWarningMessage('AI Debugger: Please log in from the panel first (AI Debugger: Open Panel).');
      debugPanel.open();
      return;
    }
    const { id: userId } = await verifyToken(context, token);
    const result = await analyzeCodeWithAi(context, code, language);
    await saveHistoryRecord(context, userId, code, language || 'plaintext', result);
    debugPanel.open();
    debugPanel.postMessage({ command: 'debugResult', data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(`AI Debugger: ${msg}`);
  }
}

