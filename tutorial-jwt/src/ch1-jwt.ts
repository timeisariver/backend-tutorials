import jwt from "jsonwebtoken";

const SECRET = "my-secret-key";

// ---------- 1. JWT を作る（サーバーがログイン成功時にやること） ----------
// TODO 1: jwt.sign で、{ userId: 123, name: "Jiro", role: "user" } を SECRET で署名する
//         有効期限は 1 時間（{ expiresIn: "1h" }）
const token = jwt.sign(
  { userId: 123, name: "Jiro", role: "user" }, // データ（payload になる）
  SECRET, // 秘密鍵（3 行目で定義済み）
  { expiresIn: "1h" }, // 期限は 1 時間
);

console.log("① できた JWT:\n", token, "\n");

// ---------- 2. 「.」で 3 つに分ける ----------
const [header, payload, signature] = token.split(".");
console.log("② header   :", header);
console.log("   payload  :", payload);
console.log("   signature:", signature, "\n");

// ---------- 3. payload を「秘密鍵なしで」読んでみる ----------
// TODO 2: payload（Base64URL の文字列）を、ふつうの文字列に戻す
//         ヒント: Buffer.from(文字列, "base64url").toString()
//         （ブラウザの atob() と同じようなもの）
const payloadJson = Buffer.from(payload, "base64url").toString();
console.log("③ 秘密鍵なしで読めた payload:", payloadJson, "\n");

// ---------- 4. サーバーが JWT を確かめる（リクエストが来たときにやること） ----------
function check(label: string, t: string, secret: string) {
  try {
    // TODO 3: jwt.verify で t を secret で確かめて、結果を decoded に入れる
    const decoded = jwt.verify(t, secret);
    console.log(`④ ${label}: OK`, decoded);
  } catch (err) {
    console.log(
      `④ ${label}: NG`,
      (err as Error).name,
      "-",
      (err as Error).message,
    );
  }
}

// 正しい秘密鍵
check("正しい鍵", token, SECRET);

// まちがった秘密鍵
check("ちがう鍵", token, "wrong-key");

// payload を書き換えて role を admin にする（なりすましを試す）
const fakePayload = Buffer.from(
  JSON.stringify({ userId: 123, name: "Jiro", role: "admin" }),
).toString("base64url");
check("改ざん", `${header}.${fakePayload}.${signature}`, SECRET);

// 有効期限が 10 秒前に切れているトークン
const expired = jwt.sign(
  { userId: 123, exp: Math.floor(Date.now() / 1000) - 10 },
  SECRET,
);
check("期限切れ", expired, SECRET);
