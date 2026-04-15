import * as vscode from 'vscode';
import { DebugPanelProvider } from './providers/DebugPanelProvider';
import { SidebarProvider } from './providers/SidebarProvider';
import { debugSelectionCommand, debugFileCommand } from './commands/debugCode';
import { showHistoryCommand } from './commands/showHistory';
import { clearHistoryCommand } from './commands/clearHistory';
import { configureCommand } from './commands/configure';

export function activate(context: vscode.ExtensionContext) {
  const debugPanel = new DebugPanelProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SidebarProvider.viewType,
      new SidebarProvider(context, debugPanel),
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aiDebugger.openPanel', () => debugPanel.open())
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aiDebugger.debugSelection', () => debugSelectionCommand(context, debugPanel))
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aiDebugger.debugFile', () => debugFileCommand(context, debugPanel))
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aiDebugger.showHistory', () => showHistoryCommand(context, debugPanel))
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aiDebugger.clearHistory', () => clearHistoryCommand(context, debugPanel))
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aiDebugger.configure', () => configureCommand(context))
  );
}

export function deactivate() {
  // VS Code disposes subscriptions automatically; mongoose connection is held in singleton.
}

