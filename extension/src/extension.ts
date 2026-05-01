import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  
  // Helper to get HTML content
  const getHtmlContent = (webview: vscode.Webview): string => {
    const distPath = path.join(context.extensionPath, '..', 'frontend', 'dist');
    const indexPath = path.join(distPath, 'index.html');

    if (fs.existsSync(indexPath)) {
      let htmlContent = fs.readFileSync(indexPath, 'utf-8');

      htmlContent = htmlContent.replace(/(href|src)="([./]*assets\/[^"]+)"/g, (match, p1, p2) => {
        const normalizedPath = p2.replace(/^[./]+/, '');
        const uri = vscode.Uri.file(path.join(distPath, normalizedPath));
        const webviewUri = webview.asWebviewUri(uri);
        return `${p1}="${webviewUri}"`;
      });

      htmlContent = htmlContent.replace(/(href|src)="([./]*[^"]+\.(svg|png|ico))"/g, (match, p1, p2) => {
        if (p2.startsWith('http')) return match;
        const normalizedPath = p2.replace(/^[./]+/, '');
        const uri = vscode.Uri.file(path.join(distPath, normalizedPath));
        const webviewUri = webview.asWebviewUri(uri);
        return `${p1}="${webviewUri}"`;
      });

      // Remove crossorigin attributes which can block loading from vscode-resource
      htmlContent = htmlContent.replace(/ crossorigin/g, '');

      return htmlContent;
    } else {
      return `<h1>Error: Frontend build not found at ${indexPath}</h1><p>Please run npm run build in the frontend directory.</p>`;
    }
  };

  // Register Sidebar View
  const provider = new SidebarProvider(context, getHtmlContent);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('ai-debugger-sidebar', provider)
  );

  // Register Command Panel
  let disposable = vscode.commands.registerCommand('ai-debugger.start', () => {
    const panel = vscode.window.createWebviewPanel(
      'aiDebugger',
      'AI Debugger',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, '..', 'frontend', 'dist'))
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
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this._context.extensionPath, '..', 'frontend', 'dist'))
      ]
    };
    webviewView.webview.html = this._getHtmlContent(webviewView.webview);
  }
}

export function deactivate() {}
