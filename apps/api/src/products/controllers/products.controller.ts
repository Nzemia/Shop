import { Request, Response } from "express";
import * as ProductService from "../services/products.service";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await ProductService.createProduct(req.body);
  res.status(201).json(product);
};

export const getAllProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const products = await ProductService.getAllProducts();
  res.status(200).json(products);
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await ProductService.getProductById(req.params.id);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  res.status(200).json(product);
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const updated = await ProductService.updateProduct(req.params.id, req.body);
  res.status(200).json(updated);
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  await ProductService.deleteProduct(req.params.id);
  res.status(204).send();
};
