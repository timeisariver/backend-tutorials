## まとめ

**ORM って何？**

DB の「行」と、コードの「オブジェクト」を自動で変換してくれるライブラリです。SQL を書かずに、関数を呼ぶだけで DB を操作できます（中で SQL が走ります）。`fetch` の結果を `res.json()` でオブジェクトにするのに近いです。

**Prisma って何？**

Node.js / TypeScript 用の ORM です。`schema.prisma` から TypeScript の型が自動で作られるので、カラム名が補完されて、打ちまちがいはエディタが教えてくれます。Rails の Active Record と役割は同じです。

**全体の中で、Prisma はどこにいる？**

```
fetch / curl → Express（API） → Prisma（ORM） → PostgreSQL（DB）
```

**Prisma を構成する 3 つは？**

| 部品 | 何をする？ | フロントでいうと |
| --- | --- | --- |
| `schema.prisma` | テーブルの形を書く | `type User = { ... }` |
| Prisma Client | コードから DB を操作する（`prisma.user.〜()`） | 型付きの API クライアント |
| Prisma Migrate | schema の変更を DB に反映して、履歴を残す | DB の形の git コミット |

**`schema.prisma` の読み方は？**

TypeScript の `type` と同じで「名前　型」の順です。

| 書き方 | 意味 |
| --- | --- |
| `content String?` | NULL でもいい（`string \| null`） |
| `@id` | 主キー |
| `@default(...)` | 値を渡さなかったときの初期値 |
| `@unique` | 同じ値は入れられない |
| `@updatedAt` | 更新したときに自動で今の時刻が入る |
| `@@map("users")` | DB 上のテーブル名（コードでは `User`、DB では `users`） |
| `author User @relation(fields: [authorId], references: [id])` | `authorId` は `User.id` を指す（外部キー） |

`@` は 1 列に、`@@` はテーブル全体に付けます。

**`posts Post[]` や `author User` は DB の列になる？**

なりません。DB にあるのは `authorId` だけです。RDB の 1 マスには値が 1 つしか入らないので、つながりは番号で表します。入れ子の形にするのは Prisma がやります。

**DB の形を変えたいときの手順は？**

1. `schema.prisma` を直す
2. `npm run migrate -- --name 変更の名前`（DB に反映して、`prisma/migrations/` に SQL が残る）
3. `npm run generate`（型付きの Prisma Client を作り直す。Prisma 7 では migrate のあとに自動で実行されない）

DB を直接いじらないようにします。`schema.prisma` と食いちがってしまうからです。

**マイグレーションって何？**

DB の形の変更を、履歴としてファイルに残してチームで共有するしくみです。Prisma 以外でも使う言葉です。

**シードって何？**

開発用の初期データを入れるスクリプトです（`prisma/seed.ts`、`npm run seed`）。何度実行しても同じ状態に戻せるようにしておきます。

**CRUD のメソッドは？**

形はどれも `prisma.テーブル.メソッド({ where, data, orderBy })` です。

| やりたいこと | メソッド | 渡すもの | SQL |
| --- | --- | --- | --- |
| 一覧がほしい | `findMany` | （必要なら）`where`、`orderBy` | `SELECT` |
| 1 件だけほしい | `findUnique` | `where`（ユニークな列） | `SELECT ... WHERE` |
| 作りたい | `create` | `data` | `INSERT` |
| 書き換えたい | `update` | `where` ＋ `data` | `UPDATE` |
| 消したい | `delete` | `where` | `DELETE` |

**`@unique` に引っかかったら、フロントにはどう届く？**

DB が拒否 → Prisma が `P2002` のエラーを投げる → Express で受け取って `409` を返す → axios なら `catch` に入る（`fetch` なら `res.ok` が `false`）。Express で受け取らなければ `500` になります。

**RDB と NoSQL（ドキュメント DB）の違いは？**

RDB（PostgreSQL など）は平らな表で持ち、DB がルール（unique、外部キー、トランザクション）を守らせてくれます。TypeScript の strict モードのようなものです。ドキュメント DB（MongoDB、Firestore）は入れ子の JSON をそのまま保存できて手軽ですが、正しさはアプリ側で守ります。迷ったら RDB がふつうです。

**MVC って何？**

コードを役割ごとにファイルで分けるルールです。

| 役割 | 担当 | 今回のファイル |
| --- | --- | --- |
| Model | DB とのやり取り（`prisma.〜()`） | `models/userModel.ts` |
| Controller | `req` を受けて、Model を呼んで、`res` で返す | `controllers/userController.ts` |
| View | 見せる形にする（API なら `res.json`） | ― |
| Routes | URL と Controller をつなぐ | `routes/userRoutes.ts` |

**リクエストはどの順番で流れる？**

```
GET /api/v1/users/1
  → app.ts（/api/v1 を付ける）
  → userRoutes.ts（GET /users/:id → show）
  → userController.ts の show（id を確認、404 などを判断）
  → userModel.ts の findById（prisma.user.findUnique）
  → DB
```

**MVC に分けると何がうれしい？**

どこを直せばいいかがすぐわかります。ORM を変えるなら Model だけ、ステータスコードがおかしいなら Controller を見ます。小さいアプリでは分けすぎに注意します。

**前回の Express のコードとの違いは？**

`app.get(URL, (req, res) => ...)` の `(req, res) => ...` を Controller に、配列の操作を Model（Prisma）に切り出しただけです。CLI と API の違いも、入口（`args` か `req`）と出口（`console.log` か `res.json`）だけで、真ん中の `prisma.user.〜()` は同じです。
