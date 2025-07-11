import { Request, Response } from "express";
import * as AdminService from "../services/admin.service";

export const getAllAdmins = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const admins = await AdminService.getAllAdmins();
  res.status(200).json(admins);
};

export const promoteUserToAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  const user = await AdminService.setRole(email, "ADMIN");
  res.status(200).json({ message: `${email} promoted to ADMIN`, user });
};

export const demoteAdminToUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  const user = await AdminService.setRole(email, "USER");
  res.status(200).json({ message: `${email} demoted to USER`, user });
};
