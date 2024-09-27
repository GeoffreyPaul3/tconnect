import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getValidityPeriodName(value: string) {
  switch (value) {
    case "7d":
      return "1 Week";
    case "30d":
      return "1 Month";
    case "90d":
      return "3 Months";
    case "180d":
      return "6 Months";
    
  }
}

