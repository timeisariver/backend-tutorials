// Express を読み込む（React の `import React from "react"` と同じ）
import express from "express";

// サーバー本体（アプリ）を作る。以降は app にルールを登録していく
const app = express();
// 待ち受けるポート番号（Vite の dev サーバーが 5173 を使うのと同じ）
const port = 3000;

// 届いたリクエストの JSON を読み、req.body で使えるようにする
// （ドキュメントのコメント「json レスポンスを使用可能にする」はまちがい。res.json() はこれがなくても使える）
// app.use(...) は「どの URL へのリクエストにも、毎回先にこの処理をはさむ」という登録（＝ミドルウェア）
app.use(express.json());

// 「GET で "/" に来たら、この関数を実行する」という登録（onClick に関数を渡すのと同じ考え方）
// req = 届いたリクエスト、res = 返すレスポンス
// _req の _ は「この引数は使わない」という印（使わない引数への警告を出さないための習慣）
app.get("/", (_req, res) => {
  // レスポンスとして文字列を返す。ブラウザに表示されたのはこれ
  res.send("Hello Express + TypeScript!");
});

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok" });
});

function randomHumanName(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let name = "";

  for (let i = 0; i < length; i++) {
    name += chars[Math.floor(Math.random() * chars.length)];
  }

  return name.charAt(0).toUpperCase() + name.slice(1);
}

// 2章の 1 万件ランダムユーザー。4章の /api/v1/users とぶつかるので URL を変えた
app.get("/api/v1/random-users", (_req, res) => {
  const data = new Array(10000).fill(0).map((_, index) => {
    return {
      id: index + 1,
      name: randomHumanName(Math.floor(Math.random() * 7) + 5),
      age: Math.floor(Math.random() * 60) + 18,
    };
  });
  res.json({ data });
});

// ===== 4章：users の CRUD =====
// DB の代わりのメモリ上の配列（React の useState の配列のようなもの。サーバーが再起動すると元に戻る）
const users = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Smith", age: 25 },
  { id: 3, name: "Alice Johnson", age: 28 },
];
// ★ドキュメントから変更：次に使う ID（ドキュメントの users.length + 1 は、削除後に ID が重複する）
let nextId = 4;

// Read（一覧）：GET /api/v1/users?page=1&limit=10
app.get("/api/v1/users", (req, res) => {
  // req.query = URL の ? より後ろ（クエリパラメータ）。値は文字列で届くので Number() で数値にする
  const { page = 1, limit = 10 } = req.query;
  const startIndex = (Number(page) - 1) * Number(limit); // 例：page=2, limit=10 → 10 番目から
  const endIndex = startIndex + Number(limit);
  const paginatedUsers = users.slice(startIndex, endIndex); // 配列の一部を切り出す

  res.json({ data: paginatedUsers });
});

// Read（1件）：GET /api/v1/users/2
// URL の :id の部分は req.params.id で取れる（React Router の useParams と同じ）
app.get("/api/v1/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => u.id === Number(id)); // id も文字列で届くので Number()
  if (!user) {
    // 見つからなければ 404。return でここで処理を終える（下の res.json まで行かせない）
    return res.status(404).json({ error: "User not found" });
  }
  res.json({
    data: user,
  });
});

// Create：POST /api/v1/users （body: {"name":"Jiro","age":30}）
app.post("/api/v1/users", (req, res) => {
  // req.body = 送られてきた JSON（express.json() のおかげで読める）。型は any なので TypeScript は守ってくれない
  // ★ドキュメントから変更：?? {} を追加。Express 5 では body なしだと req.body が undefined になり、500 エラーで落ちる
  const { name, age } = req.body ?? {};
  // バリデーション：足りなければ 400（送った側のまちがい）
  // ★ドキュメントから変更：!age だと 0 歳がはじかれるので、undefined かどうかで判定
  if (!name || age === undefined) {
    return res.status(400).json({ error: "Name and age are required" });
  }
  const newUser = {
    id: nextId++, // ★ドキュメントから変更（上の nextId を参照）
    name,
    age,
  };
  users.push(newUser);

  res.status(201).json({ data: newUser }); // 201 = 作成成功
});

// Update（一部）：PATCH /api/v1/users/2 （body: 変えたい項目だけ）
app.patch("/api/v1/users/:id", (req, res) => {
  const { name, age } = req.body ?? {}; // ★ドキュメントから変更（POST と同じ理由）
  const { id } = req.params;
  const user = users.find((u) => u.id === Number(id));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  // 送られてきた項目だけ書き換える（= PATCH が「一部更新」である理由）
  if (name) user.name = name;
  if (age) user.age = age;

  return res.json({ data: user });
});

// Delete：DELETE /api/v1/users/2
app.delete("/api/v1/users/:id", (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex((u) => u.id === Number(id)); // 見つからなければ -1
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  // splice は「取り除いた要素の配列」を返す
  // ★ドキュメントから変更：[user] で 1 件目だけ取り出す（ドキュメントのままだと data が配列になり、ほかと形がそろわない）
  const [user] = users.splice(userIndex, 1);
  res.json({ data: user });
});

// 3000 番ポートでリクエストを待ち始める。準備ができたら中の関数が 1 回だけ呼ばれる
app.listen(port, () => {
  // ターミナルに出たメッセージ（ブラウザではなくサーバー側のログ）
  console.log(`Server running on http://localhost:${port}`);
});
