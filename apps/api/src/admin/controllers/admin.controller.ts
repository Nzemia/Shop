import { Request, Response } from "express";
import * as AdminService from "../services/admin.service";

export const getCurrentAdmin = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const admin = await AdminService.getAdminById(userId);
  if (!admin) {
    res.status(404).json({ message: "Admin not found" });
    return;
  }
  res.status(200).json(admin);
};

export const updateCurrentAdmin = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { username, password } = req.body;
  const updated = await AdminService.updateAdminProfile(userId, { username, password });
  res.status(200).json(updated);
};

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
