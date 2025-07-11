import { z } from "zod";

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  role: z.enum(["USER", "ADMIN", "SUPERADMIN"]).optional()
});
