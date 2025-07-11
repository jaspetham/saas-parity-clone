import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeTrailingSlash(path: string) {
  return path.replace(/\/+$/, "");
}

export function createURL(
  href: string,
  oldParams: Record<string, any>,
  newParams: Record<string, any>
) {
  const params = new URLSearchParams();
  // Add old params
  Object.entries(oldParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      params.set(key, value);
    }
  });
  // Add/replace with new params
  Object.entries(newParams).forEach(([key, value]) => {
    if (value == undefined) {
      params.delete(key);
    } else if (typeof value === "string") {
      params.set(key, value);
    }
  });
  return `${href}?${params.toString()}`;
}
