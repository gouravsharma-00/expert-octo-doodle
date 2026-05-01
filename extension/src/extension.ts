import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {

  const getHtmlContent = (webview: vscode.Webview): string => {
    // ✅ frontend/dist is now INSIDE the extension folder
    const distUri = vscode.Uri.joinPath(context.extensionUri, 'frontend', 'dist');
    const indexPath = path.join(distUri.fsPath, 'index.html');

    if (fs.existsSync(indexPath)) {
      let htmlContent = fs.readFileSync(indexPath, 'utf-8');

      // Fix asset paths
      htmlContent = htmlContent.replace(/(href|src)="([./]*assets\/[^"]+)"/g, (match, p1, p2) => {
        const normalizedPath = p2.replace(/^[./]+/, '');
        const uri = vscode.Uri.joinPath(distUri, normalizedPath);
        return `${p1}="${webview.asWebviewUri(uri)}"`;
      });

      htmlContent = htmlContent.replace(/(href|src)="([./]*[^"]+\.(svg|png|ico))"/g, (match, p1, p2) => {
        if (p2.startsWith('http')) return match;
        const normalizedPath = p2.replace(/^[./]+/, '');
        const uri = vscode.Uri.joinPath(distUri, normalizedPath);
        return `${p1}="${webview.asWebviewUri(uri)}"`;
      });

      htmlContent = htmlContent.replace(/ crossorigin/g, '');
      return htmlContent;
    } else {
      return `<h1>Error: Frontend build not found at ${indexPath}</h1>
              <p>Please run npm run build in the frontend directory.</p>`;
    }
  };

  // Sidebar
  const provider = new SidebarProvider(context, getHtmlContent);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('ai-debugger-sidebar', provider)
  );

  // Command panel
  const disposable = vscode.commands.registerCommand('ai-debugger.start', () => {
    const panel = vscode.window.createWebviewPanel(
      'aiDebugger',
      'AI Debugger',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          // ✅ points inside the extension, not outside
          vscode.Uri.joinPath(context.extensionUri, 'frontend', 'dist')
        ]
      }
    );
    panel.webview.html = getHtmlContent(panel.webview);
  });

  context.subscriptions.push(disposable);
}

class SidebarProvider implements vscode.WebviewViewProvider {
  constructor(
    private readonly _context: vscode.ExtensionContext,
    private readonly _getHtmlContent: (webview: vscode.Webview) => string
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        // ✅ same fix here
        vscode.Uri.joinPath(this._context.extensionUri, 'frontend', 'dist')
      ]
    };
    webviewView.webview.html = this._getHtmlContent(webviewView.webview);
  }
}

export function deactivate() {}