// DB の代わりに、メモリ上の配列に入れるユーザーの型
export type User = {
  id: number;
  name: string;
  age: number;
  passwordDigest: string; // ハッシュ化したパスワード（平文は保存しない）
};

// req.user を使えるように、Express の Request 型に user を足す
// （React で props の型を広げるのと同じイメージ）
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; name: string };
    }
  }
}
