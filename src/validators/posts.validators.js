import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().min(1).max(2000),
  imageUrl: z.string().url().max(2000).optional(),
});
