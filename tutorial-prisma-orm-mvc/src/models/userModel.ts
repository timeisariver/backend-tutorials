import { prisma } from "../lib/prisma.js";

// Model：DB とのやり取りだけを担当する（req / res は知らない）

async function findAll() {
  return prisma.user.findMany({
    orderBy: { id: "asc" },
  });
}

async function findById(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function create(name: string, email: string) {
  return prisma.user.create({
    data: { name, email },
  });
}

async function update(id: number, name: string, email: string) {
  return prisma.user.update({
    where: { id },
    data: { name, email },
  });
}

async function remove(id: number) {
  return prisma.user.delete({
    where: { id },
  });
}

export const UserModel = {
  findAll,
  findById,
  create,
  update,
  delete: remove, // delete は JS の予約語なので、関数名は remove にしている
};
