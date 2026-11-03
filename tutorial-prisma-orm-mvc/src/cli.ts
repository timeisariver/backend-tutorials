import { prisma } from "./lib/prisma.js";

async function main() {
  // npm run cli -- user-create a@example.com A
  //   → command = "user-create", args = ["a@example.com", "A"]
  const [, , command, ...args] = process.argv;

  switch (command) {
    case "user-create": {
      const [email, name] = args;

      if (!email || !name) {
        console.log("usage: npm run cli -- user-create <email> <name>");
        return;
      }

      // TODO ① Create：email と name でユーザーを 1 件作る（prisma.user.create）
      const user = await prisma.user.create({
        data: { email, name },
      });

      console.log("created user:");
      console.log(user);
      return;
    }

    case "user-list": {
      // TODO ② Read（一覧）：全ユーザーを id の昇順で取る（prisma.user.findMany）
      const users = await prisma.user.findMany({
        orderBy: { id: "asc" },
      });

      console.log("users:");
      console.dir(users, { depth: null });
      return;
    }

    case "user-show": {
      const [id] = args;

      if (!id) {
        console.log("usage: npm run cli -- user-show <id>");
        return;
      }

      // TODO ③ Read（1 件）：id でユーザーを 1 件取る（prisma.user.findUnique）
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!user) {
        console.log("user not found");
        return;
      }

      console.log("user:");
      console.log(user);
      return;
    }

    case "user-update": {
      const [id, name] = args;

      if (!id || !name) {
        console.log("usage: npm run cli -- user-update <id> <name>");
        return;
      }

      // TODO ④ Update：id のユーザーの name を書き換える（prisma.user.update）
      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: { name },
      });

      console.log("updated user:");
      console.log(user);
      return;
    }

    case "user-delete": {
      const [id] = args;

      if (!id) {
        console.log("usage: npm run cli -- user-delete <id>");
        return;
      }

      // TODO ⑤ Delete：id のユーザーを消す（prisma.user.delete）
      const user = await prisma.user.delete({
        where: { id: Number(id) },
      });

      console.log("deleted user:");
      console.log(user);
      return;
    }

    default: {
      console.log(`
commands:
  npm run cli -- user-create <email> <name>
  npm run cli -- user-list
  npm run cli -- user-show <id>
  npm run cli -- user-update <id> <name>
  npm run cli -- user-delete <id>
      `);
    }
  }
}

main()
  .catch((e) => {
    console.error("error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
