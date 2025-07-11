import { Request, Response } from "express";
import * as UserService from "../services/users.service";

export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const users = await UserService.getAllUsers();
  res.status(200).json(users);
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = await UserService.getUserById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.status(200).json(user);
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const updated = await UserService.updateUser(req.params.id, req.body);
  res.status(200).json(updated);
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  await UserService.deleteUser(req.params.id);
  res.status(204).send();
};
