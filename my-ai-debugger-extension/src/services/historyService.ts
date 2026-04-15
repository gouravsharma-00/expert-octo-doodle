import type * as vscode from 'vscode';
import { ensureMongoConnected, DebugHistoryModel } from './mongoService';

export async function getHistory(context: vscode.ExtensionContext, userId: string) {
  await ensureMongoConnected(context);
  return await DebugHistoryModel.find({ userId }).sort({ createdAt: -1 });
}

export async function deleteHistoryRecord(context: vscode.ExtensionContext, userId: string, recordId: string) {
  await ensureMongoConnected(context);
  const record = await DebugHistoryModel.findById(recordId);
  if (!record) throw new Error('Record not found');
  if (record.userId.toString() !== userId) throw new Error('Not authorized');
  await record.deleteOne();
  return { message: 'Record removed' };
}

export async function clearAllHistory(context: vscode.ExtensionContext, userId: string) {
  await ensureMongoConnected(context);
  await DebugHistoryModel.deleteMany({ userId });
  return { message: 'All records removed' };
}

export async function saveHistoryRecord(
  context: vscode.ExtensionContext,
  userId: string,
  code: string,
  language: string,
  result: unknown
) {
  await ensureMongoConnected(context);
  return await DebugHistoryModel.create({ userId, code, language, result });
}

