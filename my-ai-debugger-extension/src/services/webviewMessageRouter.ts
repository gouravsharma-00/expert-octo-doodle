import type * as vscode from 'vscode';
import { analyzeCodeWithAi, chatWithAi, nlDebugWithAi } from './aiService';
import { loginUser, registerUser, verifyToken } from './authService';
import { deleteHistoryRecord, getHistory, saveHistoryRecord } from './historyService';

type AnyRecord = Record<string, unknown>;

function isRecord(v: unknown): v is AnyRecord {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function getString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

function getBool(v: unknown): boolean | undefined {
  return typeof v === 'boolean' ? v : undefined;
}

export async function handleWebviewMessage(
  context: vscode.ExtensionContext,
  webview: vscode.Webview,
  message: unknown
): Promise<void> {
  if (!isRecord(message)) return;
  const command = getString(message.command);
  const payload = isRecord(message.payload) ? message.payload : {};
  const requestId = getString(message.requestId) ?? undefined;

  const reply = (data: unknown) =>
    webview.postMessage({ command: `${command}Result`, requestId, data });
  const replyError = (error: unknown) => {
    const msg = error instanceof Error ? error.message : String(error);
    return webview.postMessage({ command: `${command}Error`, requestId, error: msg });
  };

  try {
    if (!command) return;

    switch (command) {
      case 'auth.register': {
        const email = getString(payload.email);
        const password = getString(payload.password);
        if (!email || !password) throw new Error('Email and password are required');
        return void reply(await registerUser(context, email, password));
      }

      case 'auth.login': {
        const email = getString(payload.email);
        const password = getString(payload.password);
        if (!email || !password) throw new Error('Email and password are required');
        return void reply(await loginUser(context, email, password));
      }
      case 'auth.cacheToken': {
        const token = getString(payload.token);
        if (!token) throw new Error('Missing token');
        await context.secrets.store('authToken', token);
        return void reply({ ok: true });
      }

      case 'debug.analyze': {
        const token = getString(payload.token);
        const code = getString(payload.code) ?? '';
        const language = getString(payload.language) ?? 'plaintext';
        if (!token) throw new Error('Not authorized');
        const { id: userId } = await verifyToken(context, token);
        const result = await analyzeCodeWithAi(context, code, language);
        await saveHistoryRecord(context, userId, code, language || 'plaintext', result);
        return void reply(result);
      }

      case 'history.get': {
        const token = getString(payload.token);
        if (!token) throw new Error('Not authorized');
        const { id: userId } = await verifyToken(context, token);
        return void reply(await getHistory(context, userId));
      }

      case 'history.delete': {
        const token = getString(payload.token);
        const id = getString(payload.id);
        if (!token) throw new Error('Not authorized');
        if (!id) throw new Error('Missing id');
        const { id: userId } = await verifyToken(context, token);
        return void reply(await deleteHistoryRecord(context, userId, id));
      }

      case 'chat.send': {
        const token = getString(payload.token);
        if (!token) throw new Error('Not authorized');
        await verifyToken(context, token);
        const messages = Array.isArray(payload.messages) ? (payload.messages as any[]) : [];
        const codeContext = getString(payload.codeContext);
        const language = getString(payload.language);
        const hintMode = getBool(payload.hintMode);
        return void reply(await chatWithAi(context, messages as any, codeContext, language, hintMode));
      }

      case 'nlDebug.analyze': {
        const token = getString(payload.token);
        if (!token) throw new Error('Not authorized');
        await verifyToken(context, token);
        const description = getString(payload.description) ?? '';
        const code = getString(payload.code);
        const language = getString(payload.language);
        return void reply(await nlDebugWithAi(context, description, code, language));
      }

      default:
        return;
    }
  } catch (err) {
    await replyError(err);
  }
}

