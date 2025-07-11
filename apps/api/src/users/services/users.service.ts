import prisma from "../../shared/config/database.config";
import { Role } from "@prisma/client";

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true
    }
  });
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true
    }
  });
};

export const updateUser = async (
  id: string,
  data: Partial<{ username: string; role: string }>
) => {
  const prismaData: any = { ...data };
  if (data.role !== undefined) {
    prismaData.role = { set: data.role as Role };
  }
  return prisma.user.update({
    where: { id },
    data: prismaData,
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      updatedAt: true
    }
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({ where: { id } });
};
