import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface Props {
  tenantSubdomain: string;
  productId: string;
}

export const CartButton = ({ tenantSubdomain, productId }: Props) => {
  const cart = useCart(tenantSubdomain);

  return (
    <Button
      variant="elevated"
      className={cn(
        "flex-1 bg-pink-400",
        cart.isProductInCart(productId) && "bg-white",
      )}
      onClick={() => {
        cart.toggleProduct(productId);
      }}
    >
      {cart.isProductInCart(productId) ? "Remove from cart" : "Add to cart"}
    </Button>
  );
};
