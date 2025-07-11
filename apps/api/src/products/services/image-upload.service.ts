import { Multer } from "multer";

export const uploadImages = async (files: Express.Multer.File[]) => {
  // Placeholder: return mock URLs
  return files.map((file) => `https://fakecdn.com/${file.filename}`);
};
