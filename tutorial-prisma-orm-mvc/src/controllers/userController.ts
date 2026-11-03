import type { Request, Response } from "express";
import { UserModel } from "../models/userModel.js";

// Controller：req を受け取る → Model を呼ぶ → res で返す

async function index(req: Request, res: Response) {
  const users = await UserModel.findAll();
  res.json(users);
}

async function show(req: Request, res: Response) {
  // TODO ① GET /users/:id
  //   1. req.params.id を数値にする。数値でなければ 400
  //   2. UserModel.findById で探す。見つからなければ 404
  //   3. 見つかったら res.json で返す

  // 1
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }

  // 2
  const user = await UserModel.findById(id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // 3
  res.json(user);
}

async function create(req: Request, res: Response) {
  // TODO ② POST /users
  //   1. req.body から name と email を取り出す。どちらかがなければ 400
  //   2. UserModel.create で作る
  //   3. 201 で返す
  // 1
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: "name and email are required" });
    return;
  }
  // 2
  const user = await UserModel.create(name, email);
  // 3
  res.status(201).json(user);
}

async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name, email } = req.body;

  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }

  if (!name || !email) {
    res.status(400).json({ error: "name and email are required" });
    return;
  }

  const existingUser = await UserModel.findById(id);

  if (!existingUser) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const user = await UserModel.update(id, name, email);
  res.json(user);
}

async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }

  const existingUser = await UserModel.findById(id);

  if (!existingUser) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  await UserModel.delete(id);
  res.status(204).send();
}

export const UserController = {
  index,
  show,
  create,
  update,
  delete: remove,
};
