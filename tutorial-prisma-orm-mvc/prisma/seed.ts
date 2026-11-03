import { prisma } from "../src/lib/prisma.js";

async function main() {
  // いったん全部消してから入れ直す（何度実行しても同じ状態になる）
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // ユーザーと、そのユーザーの投稿 2 件を、まとめて作る
  const taro = await prisma.user.create({
    data: {
      email: "taro@example.com",
      name: "Taro",
      posts: {
        create: [
          {
            title: "Prisma 入門",
            content: "Prisma は型安全に DB を扱える ORM です",
            published: true,
          },
          {
            title: "PostgreSQL メモ",
            content: "Docker 上で PostgreSQL を起動しました",
            published: false,
          },
        ],
      },
    },
    include: {
      posts: true,
    },
  });

  const hanako = await prisma.user.create({
    data: {
      email: "hanako@example.com",
      name: "Hanako",
    },
  });

  console.log("seed completed");
  console.log({ taro, hanako });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
