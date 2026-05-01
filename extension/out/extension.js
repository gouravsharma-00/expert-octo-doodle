"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function activate(context) {
    const getHtmlContent = (webview) => {
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
                if (p2.startsWith('http'))
                    return match;
                const normalizedPath = p2.replace(/^[./]+/, '');
                const uri = vscode.Uri.joinPath(distUri, normalizedPath);
                return `${p1}="${webview.asWebviewUri(uri)}"`;
            });
            htmlContent = htmlContent.replace(/ crossorigin/g, '');
            return htmlContent;
        }
        else {
            return `<h1>Error: Frontend build not found at ${indexPath}</h1>
              <p>Please run npm run build in the frontend directory.</p>`;
        }
    };
    // Sidebar
    const provider = new SidebarProvider(context, getHtmlContent);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('ai-debugger-sidebar', provider));
    // Command panel
    const disposable = vscode.commands.registerCommand('ai-debugger.start', () => {
        const panel = vscode.window.createWebviewPanel('aiDebugger', 'AI Debugger', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [
                // ✅ points inside the extension, not outside
                vscode.Uri.joinPath(context.extensionUri, 'frontend', 'dist')
            ]
        });
        panel.webview.html = getHtmlContent(panel.webview);
    });
    context.subscriptions.push(disposable);
}
class SidebarProvider {
    _context;
    _getHtmlContent;
    constructor(_context, _getHtmlContent) {
        this._context = _context;
        this._getHtmlContent = _getHtmlContent;
    }
    resolveWebviewView(webviewView, _context, _token) {
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
function deactivate() { }
//# sourceMappingURL=extension.js.map