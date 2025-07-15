import prisma from "../../shared/config/database.config";

export const getAllAdmins = async () => {
  return prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "SUPERADMIN"]
      }
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true
    }
  });
};

export const setRole = async (email: string, newRole: "USER" | "ADMIN") => {
  return prisma.user.update({
    where: { email },
    data: { role: newRole },
    select: {
      id: true,
      email: true,
      username: true,
      role: true
    }
  });
};

export const getAdminById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true
    }
  });
};

export const updateAdminProfile = async (
  id: string,
  data: { username?: string; password?: string }
) => {
  const updateData: any = {};
  if (data.username) updateData.username = data.username;
  if (data.password && data.password.trim()) {
    const bcrypt = require("bcryptjs");
    updateData.password = await bcrypt.hash(data.password, 10);
  }
  return prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      username: true,
      role: true
    }
  });
};
