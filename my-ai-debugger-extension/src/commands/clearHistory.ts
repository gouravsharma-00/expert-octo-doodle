import * as vscode from 'vscode';
import { DebugPanelProvider } from '../providers/DebugPanelProvider';
import { clearAllHistory } from '../services/historyService';
import { verifyToken } from '../services/authService';

export async function clearHistoryCommand(
  context: vscode.ExtensionContext,
  debugPanel: DebugPanelProvider
): Promise<void> {
  try {
    const token = await context.secrets.get('authToken');
    if (!token) {
      vscode.window.showWarningMessage('AI Debugger: Please log in from the panel first.');
      debugPanel.open();
      return;
    }
    const { id: userId } = await verifyToken(context, token);
    await clearAllHistory(context, userId);
    vscode.window.showInformationMessage('AI Debugger: History cleared.');
    debugPanel.open();
    debugPanel.postMessage({ command: 'historyCleared' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(`AI Debugger: ${msg}`);
  }
}

