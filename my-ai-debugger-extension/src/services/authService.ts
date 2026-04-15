import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type * as vscode from 'vscode';
import { SECRET_KEYS } from '../commands/configure';
import { ensureMongoConnected, UserModel } from './mongoService';

export type AuthResponse = { _id: string; email: string; token: string };

async function getJwtSecret(context: vscode.ExtensionContext): Promise<string> {
  const secret = await context.secrets.get(SECRET_KEYS.jwtSecret);
  if (!secret) {
    throw new Error('JWT secret missing. Run "AI Debugger: Configure" once.');
  }
  return secret;
}

export async function registerUser(
  context: vscode.ExtensionContext,
  email: string,
  password: string
): Promise<AuthResponse> {
  await ensureMongoConnected(context);

  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await UserModel.create({ email, password: hashedPassword });
  const jwtSecret = await getJwtSecret(context);
  const token = jwt.sign({ id: user._id.toString() }, jwtSecret, { expiresIn: '30d' });

  return { _id: user._id.toString(), email: user.email, token };
}

export async function loginUser(
  context: vscode.ExtensionContext,
  email: string,
  password: string
): Promise<AuthResponse> {
  await ensureMongoConnected(context);

  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');

  const jwtSecret = await getJwtSecret(context);
  const token = jwt.sign({ id: user._id.toString() }, jwtSecret, { expiresIn: '30d' });

  return { _id: user._id.toString(), email: user.email, token };
}

export async function verifyToken(context: vscode.ExtensionContext, token: string): Promise<{ id: string }> {
  const jwtSecret = await getJwtSecret(context);
  const decoded = jwt.verify(token, jwtSecret) as { id: string };
  if (!decoded?.id) throw new Error('Not authorized');
  return { id: decoded.id };
}

