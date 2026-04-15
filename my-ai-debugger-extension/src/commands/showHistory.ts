import * as vscode from 'vscode';
import { DebugPanelProvider } from '../providers/DebugPanelProvider';

export async function showHistoryCommand(
  _context: vscode.ExtensionContext,
  debugPanel: DebugPanelProvider
): Promise<void> {
  // UI already has /history route; opening panel is sufficient.
  debugPanel.open();
  debugPanel.postMessage({ command: 'navigate', data: { path: '/history' } });
}

