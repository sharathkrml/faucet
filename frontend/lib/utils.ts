import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SERVER_URL } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

