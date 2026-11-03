import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// .env から秘密鍵を読む（npm run dev が --env-file=.env で読み込んでいる）
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET が .env にありません");
export const JWT_SECRET: string = secret;

// ---------- パスワード（流し読みで OK） ----------

// 平文のパスワード → ハッシュ（元に戻せない文字列）
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// 送られてきた平文と、保存してあるハッシュが合っているか
export function verifyPassword(password: string, passwordDigest: string): Promise<boolean> {
  return bcrypt.compare(password, passwordDigest);
}

// ---------- JWT を作る（1 章でやったのと同じ） ----------

export function generateAccessToken(id: number, name: string): string {
  return jwt.sign({ id, name }, JWT_SECRET, { expiresIn: "1h" });
}

// ---------- ここからがフロントに関わるところ ----------

// JWT を Cookie に保存する（レスポンスに Set-Cookie ヘッダーが付く）
export function saveToken(res: Response, token: string): void {
  res.cookie("accessToken", token, {
    httpOnly: true, // JS（document.cookie）から読めない → XSS で盗まれない
    secure: process.env.NODE_ENV === "production", // 本番は HTTPS のときだけ送る
    sameSite: "strict", // 他のサイトからのリクエストには付けない → CSRF 対策
    maxAge: 60 * 60 * 1000, // Cookie の期限（ミリ秒）。JWT の期限 1h に合わせる
  });
}

// リクエストから JWT を取り出す。Cookie → Authorization ヘッダーの順に探す
export function getToken(req: Request): string | null {
  const fromCookie = req.cookies?.accessToken;
  if (fromCookie) return fromCookie;

  const authHeader = req.headers.authorization; // "Bearer eyJ..."
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice("Bearer ".length);

  return null;
}
