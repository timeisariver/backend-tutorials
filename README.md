# backend-tutorials

バックエンドの基本を学んだときの記録です。フロントの `fetch` から DB まで、どうつながっているかを 1 つずつ手を動かして確かめました。

まとめて読むなら → **[all-summary.md](all-summary.md)**

## 学んだ順番

| # | フォルダ | 内容 | まとめ |
| - | -------- | ---- | ------ |
| 1 | [tutorial-postgressql-docker](tutorial-postgressql-docker) | Docker で PostgreSQL を動かし、SQL でテーブルを作る | [summary](tutorial-postgressql-docker/summary.md) |
| 2 | [tutorial-express-ts](tutorial-express-ts) | Express + TypeScript で API サーバーを作る | [summary](tutorial-express-ts/summary.md) |
| 3 | [tutorial-prisma-orm-mvc](tutorial-prisma-orm-mvc) | Prisma（ORM）で DB を操作し、MVC に分けて書く | [summary](tutorial-prisma-orm-mvc/summary.md) |
| 4 | [tutorial-jwt](tutorial-jwt) | JWT でログインと認証ミドルウェアを作る | [summary](tutorial-jwt/summary.md) |

## 全体の流れ

```
fetch（フロント）
  → Express（API サーバー）
      → 認証ミドルウェア（JWT）
      → Routes → Controller → Model（Prisma）
  → PostgreSQL（DB）
```

## メモ

- 学習用なので、本番で使うことは考えていません。
- `.env` はリポジトリに入れていません。動かすときは各フォルダで用意してください。
