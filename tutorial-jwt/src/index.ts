import express from "express";
import cookieParser from "cookie-parser";
import type { User } from "./types.js";
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  saveToken,
} from "./auth.js";
import { authenticate } from "./middleware.js";

const app = express();
const port = 3000;

app.use(express.json()); // body の JSON を req.body に入れる
app.use(cookieParser()); // Cookie を req.cookies に入れる
app.use(authenticate(["/api/v1/auth/sign_up", "/api/v1/auth/sign_in"])); // この 2 つ以外は要ログイン

const users: User[] = [];

// フロントに返すときは passwordDigest を外す
const toResponse = (u: User) => ({ id: u.id, name: u.name, age: u.age });

// ---------- 登録（流し読みで OK） ----------
app.post("/api/v1/auth/sign_up", async (req, res) => {
  const { name, age, password, passwordConfirmation } = req.body;
  if (password !== passwordConfirmation) {
    res.status(400).json({ error: "パスワードとパスワード確認が一致しません" });
    return;
  }
  if (typeof age !== "number" || age <= 0) {
    res.status(400).json({ error: "年齢は0より大きい数値である必要があります" });
    return;
  }
  if (typeof name !== "string" || name.length < 3) {
    res.status(400).json({ error: "名前は3文字以上である必要があります" });
    return;
  }
  if (users.some((u) => u.name === name)) {
    res.status(400).json({ error: "その名前は既に使用されています" });
    return;
  }

  const newUser: User = {
    id: users.length + 1,
    name,
    age,
    passwordDigest: await hashPassword(password),
  };
  users.push(newUser);
  res.status(201).json({ data: toResponse(newUser) });
});

// ---------- ログイン ----------
app.post("/api/v1/auth/sign_in", async (req, res) => {
  const { name, password } = req.body;
  const user = users.find((u) => u.name === name);

  if (!user || !(await verifyPassword(password, user.passwordDigest))) {
    res.status(401).json({ error: "ユーザー名あるいはパスワードが間違っています。" });
    return;
  }

  const token = generateAccessToken(user.id, user.name);
  saveToken(res, token);
  res.json({ accessToken: token, data: toResponse(user) });
});

// ---------- ログアウト ----------
app.post("/api/v1/auth/sign_out", (_req, res) => {
  res.clearCookie("accessToken");
  res.json({ data: "Successfully signed out" });
});

// ---------- ログイン中のユーザー ----------
app.get("/api/v1/users/me", (req, res) => {
  // ここに来た時点で、ミドルウェアが req.user を入れてくれている
  const user = users.find((u) => u.id === req.user?.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ data: toResponse(user) });
});

app.patch("/api/v1/users/me", (req, res) => {
  const user = users.find((u) => u.id === req.user?.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const { age } = req.body;
  if (age !== undefined) {
    if (typeof age !== "number" || age <= 0) {
      res.status(400).json({ error: "年齢は0より大きい数値である必要があります" });
      return;
    }
    user.age = age;
  }
  res.json({ data: toResponse(user) });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
