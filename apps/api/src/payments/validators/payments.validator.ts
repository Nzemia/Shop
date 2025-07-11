import { z } from "zod";

export const mpesaCodeSchema = z.object({
  transactionId: z.string().min(6)
});
