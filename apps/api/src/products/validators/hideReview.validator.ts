import { z } from "zod";

export const hideReviewSchema = z.object({
  hidden: z.boolean()
});
