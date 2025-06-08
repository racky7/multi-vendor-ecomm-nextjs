import { useCartStore } from "../store/use-cart-store";

export const useCart = (tenantSubdomain: string) => {
  const {
    addProduct,
    removeProduct,
    getCartByTenant,
    clearCart,
    clearAllCarts,
  } = useCartStore();

  const productIds = getCartByTenant(tenantSubdomain);

  const toggleProduct = (productId: string) => {
    if (productIds.includes(productId)) {
      removeProduct(tenantSubdomain, productId);
    } else {
      addProduct(tenantSubdomain, productId);
    }
  };

  const isProductInCart = (productId: string) => {
    return productIds.includes(productId);
  };

  const clearTenantCart = () => {
    clearCart(tenantSubdomain);
  };

  return {
    productIds,
    addProduct: (productId: string) => addProduct(tenantSubdomain, productId),
    removeProduct: (productId: string) =>
      removeProduct(tenantSubdomain, productId),
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProduct,
    isProductInCart,
    totalItems: productIds.length,
  };
};
