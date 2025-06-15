import { removeTrailingSlash } from "@/lib/utils";
import { z } from "zod";

export const productDetailsSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  url: z.string().url().min(1, "URL is required").transform(removeTrailingSlash),
  description: z.string().optional(),
});
