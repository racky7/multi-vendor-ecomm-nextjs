import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TenantCart {
  productIds: string[];
}

interface CartState {
  tenantCarts: Record<string, TenantCart>;
  addProduct: (tenantSubdomain: string, productId: string) => void;
  removeProduct: (tenantSubdomain: string, productId: string) => void;
  clearCart: (tenantSubdomain: string) => void;
  clearAllCarts: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      tenantCarts: {},
      addProduct: (tenantSubdomain, productId) => {
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSubdomain]: {
              productIds: [
                ...(state.tenantCarts[tenantSubdomain]?.productIds || []),
                productId,
              ],
            },
          },
        }));
      },
      removeProduct: (tenantSubdomain, productId) => {
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSubdomain]: {
              productIds: (
                state.tenantCarts[tenantSubdomain]?.productIds || []
              ).filter((pId) => pId !== productId),
            },
          },
        }));
      },
      clearCart: (tenantSubdomain) => {
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSubdomain]: {
              productIds: [],
            },
          },
        }));
      },
      clearAllCarts: () => {
        set({
          tenantCarts: {},
        });
      },
    }),
    {
      name: "funroadCart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
