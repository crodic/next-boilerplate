import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a consistent query key for Tanstack Query
 */
export function generateQueryKeys(scope: string, ...args: unknown[]) {
  return [scope, ...args] as const;
}
