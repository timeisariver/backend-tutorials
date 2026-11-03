## まとめ

**Express って何？**

Node.js で Web サーバーや API を作るためのフレームワークです。フロントの `fetch` を受け取って、返事を返す側を作ります。

**コードの基本の形は？**

```ts
app.get("/api/v1/users", (req, res) => {
  res.json({ data: users });
});
```

「この URL にこのメソッドで来たら、この関数を実行する」という登録です。React の `onClick` に関数を渡すのと同じ考え方です。`req` は届いたリクエスト、`res` は返すレスポンスです。

**実際に動いているファイルは？**

`src/index.ts` を `tsc` が JS に変換した `dist/index.js` です。フロントの `vite build` で `dist/` ができるのと同じです。

**REST って何？**

「URL で何を扱うか（名詞）、HTTP メソッドで何をするか（動詞）」を表す API の設計スタイルです。ライブラリではなく考え方です。`/getUsers` ではなく `GET /users` と書きます。

**CRUD と API の対応は？**

|  | メソッド | URL | 成功したとき |
| --- | --- | --- | --- |
| 一覧取得 | `GET` | `/users` | 200 |
| 1件取得 | `GET` | `/users/:id` | 200 |
| 作成 | `POST` | `/users` | 201 |
| 更新 | `PATCH` | `/users/:id` | 200 |
| 削除 | `DELETE` | `/users/:id` | 200 |

**リクエストの中身はどこから取る？**

| 取り出す場所 | 中身 | 例 | フロントでいうと |
| --- | --- | --- | --- |
| `req.params` | URL の `:id` の部分 | `/users/2` → `"2"` | `useParams()` |
| `req.query` | URL の `?` より後ろ | `?page=2` → `"2"` | `URLSearchParams` |
| `req.body` | 送られてきた JSON | `{"name":"Jiro"}` | fetch の `body` |

`params` と `query` は文字列で届くので、`Number()` で数値にします。`req.body` は `app.use(express.json())` があるから読めます。

**HTTP は何でできている？**

`fetch(url, { method, headers, body })` の中身そのものです。リクエストはメソッドと URL、ヘッダー、ボディでできています。レスポンスはステータスコード、ヘッダー、ボディでできています。`Content-Type: application/json` は「ボディが JSON だ」という印です。

**ステータスコードは？**

2xx は成功、4xx は送った側のまちがい、5xx はサーバー側の問題です。よく使うのは 200（成功）、201（作成成功）、400（リクエスト不正）、404（見つからない）、500（サーバーエラー）。エラーなら何でも 500、ではありません。

**`return res.status(404).json(...)` の `return` は？**

「ここで処理を終える」という意味です。React の早期 return と同じです。

**`req.body` の型は？**

`any` です。TypeScript は中身をチェックしないので、自分でバリデーションして、だめなら 400 を返します。

**データはどこにある？**

今回は DB を使わず、メモリ上の配列に置いています。サーバーが再起動すると元に戻ります。本番では、この配列の操作が SQL（INSERT、SELECT など）に置き換わります。

**curl のオプションは？**

`-X` は `method`、`-H` は `headers`、`-d` は `body` です。`-i` を付けると、ステータスコードとヘッダーも見えます。
