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
