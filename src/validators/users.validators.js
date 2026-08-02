import { z } from "zod";

export const updateMeSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(280).nullish(),
  avatarUrl: z.string().url().max(2000).nullish(),
});
