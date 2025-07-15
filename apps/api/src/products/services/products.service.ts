import prisma from "../../shared/config/database.config";

export const createProduct = async (data: any) => {
  return prisma.product.create({ data });
};

export const getAllProducts = async () => {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reviews: true
    }
  });
};

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      reviews: true
    }
  });
};

export const updateProduct = async (id: string, data: any) => {
  return prisma.product.update({ where: { id }, data });
};

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({ where: { id } });
};
