import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../../hooks/use-cart";
import { cn, generateTenantURL } from "@/lib/utils";

interface CheckoutButtonProps {
  className?: string;
  hideIfEmpty?: boolean;
  tenantSubdomain: string;
}

export const CheckoutButton = ({
  className,
  hideIfEmpty,
  tenantSubdomain,
}: CheckoutButtonProps) => {
  const { totalItems } = useCart(tenantSubdomain);

  if (hideIfEmpty && totalItems === 0) return null;

  return (
    <Button variant="elevated" asChild className={cn("bg-white", className)}>
      <Link href={`${generateTenantURL(tenantSubdomain)}/checkout`}>
        <ShoppingCartIcon /> {totalItems > 0 ? totalItems : ""}
      </Link>
    </Button>
  );
};
