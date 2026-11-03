import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { getToken, JWT_SECRET } from "./auth.js";

// 認証ミドルウェア：各 API の「前」に挟まって、JWT を確かめる
// excludePaths にあるパス（ログイン前に使う API）は確かめずに通す
export function authenticate(excludePaths: string[] = []) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (excludePaths.includes(req.path)) {
      next(); // 次（本来の API の処理）へ進む
      return;
    }

    const token = getToken(req);
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      req.user = { id: decoded.id, name: decoded.name };
      next();
    } catch {
      // はんこが合わない、期限切れ、など
      res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}
