import mongoose from 'mongoose';
import * as vscode from 'vscode';
import { SECRET_KEYS } from '../commands/configure';

type MongooseConnectionState = {
  connecting?: Promise<typeof mongoose>;
};

const state: MongooseConnectionState = {};

export async function ensureMongoConnected(context: vscode.ExtensionContext): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (state.connecting) return state.connecting;

  state.connecting = (async () => {
    let uri = await context.secrets.get(SECRET_KEYS.mongoUri);
    if (!uri) {
      uri = await vscode.window.showInputBox({
        prompt: 'Enter your MongoDB Atlas URI (saved securely in VS Code Secrets)',
        password: true,
        ignoreFocusOut: true
      });
      if (!uri) {
        throw new Error('Missing MongoDB URI. Run "AI Debugger: Configure" and provide a URI.');
      }
      await context.secrets.store(SECRET_KEYS.mongoUri, uri);
    }
    await mongoose.connect(uri);
    return mongoose;
  })();

  return state.connecting;
}

// --- Schemas/Models (mirrors backend) ---

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

const debugHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    result: { type: Object, required: true }
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User ?? mongoose.model('User', userSchema);
export const DebugHistoryModel =
  mongoose.models.DebugHistory ?? mongoose.model('DebugHistory', debugHistorySchema);

