import { removeTrailingSlash } from "@/lib/utils";
import { z } from "zod";

export const productDetailsSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  url: z
    .string()
    .url()
    .min(1, "URL is required")
    .transform(removeTrailingSlash),
  description: z.string().optional(),
});

export const productCountryDiscountsSchema = z.object({
  groups: z.array(
    z
      .object({
        countryGroupId: z.string().min(1, "Required"),
        discountPercentage: z
          .number()
          .max(100)
          .min(1)
          .or(z.nan())
          .transform((n) => (isNaN(n) ? undefined : n))
          .optional(),
        coupon: z.string().optional(),
      })
      .refine(
        (value) => {
          const hasCoupon = value.coupon != null && value.coupon.length > 0;
          const hasDiscount = value.discountPercentage != null;
          return !(hasCoupon && !hasDiscount);
        },
        {
          message: "A discount percentage is required if a coupon is provided.",
          path: ["root"],
        }
      )
  ),
});

export const productCustomizationSchema = z.object({
    classPrefix: z.string().optional(),
    backgroundColor: z.string().min(1, "Background color is required"),
    textColor: z.string().min(1, "Text color is required"),
    fontSize: z.string().min(1, "Font size is required"),
    locationMessage: z.string().min(1, "Location message is required"),
    bannerContainer: z.string().min(1, "Banner container is required"),
    isSticky: z.boolean()
})