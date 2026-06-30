import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert prisma object into regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// format nuber with decimal places
export function formatNumberWithDecimal(value: number): string {
  const [int, decimal] = value.toString().split(".");

  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}
