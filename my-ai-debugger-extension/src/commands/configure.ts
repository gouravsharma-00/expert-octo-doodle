import * as vscode from 'vscode';

const SECRET_KEYS = {
  mongoUri: 'mongoUri',
  geminiApiKey: 'geminiApiKey',
  jwtSecret: 'jwtSecret'
} as const;

async function ensureJwtSecret(context: vscode.ExtensionContext): Promise<void> {
  const existing = await context.secrets.get(SECRET_KEYS.jwtSecret);
  if (existing) return;
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const secret = Buffer.from(bytes).toString('base64url');
  await context.secrets.store(SECRET_KEYS.jwtSecret, secret);
}

export async function configureCommand(context: vscode.ExtensionContext): Promise<void> {
  await ensureJwtSecret(context);

  const mongoUri = await vscode.window.showInputBox({
    prompt: 'Enter your MongoDB Atlas URI',
    password: true,
    ignoreFocusOut: true
  });
  if (mongoUri) {
    await context.secrets.store(SECRET_KEYS.mongoUri, mongoUri);
    vscode.window.showInformationMessage('AI Debugger: MongoDB URI saved in VS Code secrets.');
  }

  const geminiApiKey = await vscode.window.showInputBox({
    prompt: 'Enter your Gemini API Key',
    password: true,
    ignoreFocusOut: true
  });
  if (geminiApiKey) {
    await context.secrets.store(SECRET_KEYS.geminiApiKey, geminiApiKey);
    vscode.window.showInformationMessage('AI Debugger: AI API key saved in VS Code secrets.');
  }
}

export { SECRET_KEYS };

