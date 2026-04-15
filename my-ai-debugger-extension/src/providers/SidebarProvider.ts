import * as vscode from 'vscode';
import { getNonce } from '../utils/getNonce';
import { DebugPanelProvider } from './DebugPanelProvider';

export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'aiDebugger.sidebar';

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly debugPanel: DebugPanelProvider
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri]
    };

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      if (!msg || typeof msg !== 'object') return;
      // Minimal sidebar messages; main panel handles full app traffic.
      const command = /** @type {any} */ (msg).command;
      if (command === 'openPanel') {
        this.debugPanel.open();
      } else if (command === 'debugSelection') {
        await vscode.commands.executeCommand('aiDebugger.debugSelection');
      } else if (command === 'showHistory') {
        await vscode.commands.executeCommand('aiDebugger.showHistory');
      } else if (command === 'configure') {
        await vscode.commands.executeCommand('aiDebugger.configure');
      }
    });

    webviewView.webview.html = this.getHtml(webviewView.webview);
  }

  private getHtml(webview: vscode.Webview): string {
    const nonce = getNonce();
    const csp = [
      `default-src 'none';`,
      `img-src ${webview.cspSource} https: data:;`,
      `style-src ${webview.cspSource} 'unsafe-inline';`,
      `script-src 'nonce-${nonce}';`
    ].join(' ');

    return /* html */ `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="${csp}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Debugger</title>
    <style>
      body { padding: 10px; }
      button { width: 100%; margin: 6px 0; padding: 10px; }
    </style>
  </head>
  <body>
    <button id="open">Open Panel</button>
    <button id="debugSel">Debug Selection</button>
    <button id="history">Show History</button>
    <button id="configure">Configure</button>
    <script nonce="${nonce}">
      const vscodeApi = acquireVsCodeApi();
      document.getElementById('open').addEventListener('click', () => vscodeApi.postMessage({ command: 'openPanel' }));
      document.getElementById('debugSel').addEventListener('click', () => vscodeApi.postMessage({ command: 'debugSelection' }));
      document.getElementById('history').addEventListener('click', () => vscodeApi.postMessage({ command: 'showHistory' }));
      document.getElementById('configure').addEventListener('click', () => vscodeApi.postMessage({ command: 'configure' }));
    </script>
  </body>
</html>`;
  }
}

