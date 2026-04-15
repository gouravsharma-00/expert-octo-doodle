import * as vscode from 'vscode';
import { getNonce } from '../utils/getNonce';
import { handleWebviewMessage } from '../services/webviewMessageRouter';

export class DebugPanelProvider {
  private panel: vscode.WebviewPanel | undefined;

  constructor(private readonly context: vscode.ExtensionContext) {}

  public open(): vscode.WebviewPanel {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.One);
      return this.panel;
    }

    this.panel = vscode.window.createWebviewPanel(
      'aiDebugger.main',
      'AI Debugger',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [this.context.extensionUri]
      }
    );

    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });

    this.panel.webview.onDidReceiveMessage(async (message) => {
      await handleWebviewMessage(this.context, this.panel!.webview, message);
    });

    this.panel.webview.html = this.getHtml(this.panel.webview);
    return this.panel;
  }

  public postMessage(message: unknown): Thenable<boolean> | undefined {
    return this.panel?.webview.postMessage(message);
  }

  public getWebview(): vscode.Webview | undefined {
    return this.panel?.webview;
  }

  private getHtml(webview: vscode.Webview): string {
    const nonce = getNonce();
    const webviewJs = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview.js')
    );

    // Webview CSS is inlined by style-loader; we only need JS.
    const csp = [
      `default-src 'none';`,
      `img-src ${webview.cspSource} https: data:;`,
      `font-src ${webview.cspSource} https: data:;`,
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
  </head>
  <body>
    <div id="root"></div>
    <script nonce="${nonce}">
      window.vscodeApi = acquireVsCodeApi();
    </script>
    <script nonce="${nonce}" src="${webviewJs}"></script>
  </body>
</html>`;
  }
}

