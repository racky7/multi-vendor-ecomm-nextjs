import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTenantURL(subdomain: string) {
  // In development mode, use normal routing
  if (process.env.NODE_ENV === "development") {
    return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${subdomain}`;
  }

  // in production use subdomain routing
  const protocol = "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!

  return `${protocol}://${subdomain}.${domain}`;

}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}
