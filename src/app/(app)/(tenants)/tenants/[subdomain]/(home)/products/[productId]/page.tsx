import { ProductView, ProductViewSkeleton } from "@/modules/tenants/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{ productId: string; subdomain: string }>;
}

const Page = async ({ params }: Props) => {
  const { productId, subdomain } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} tenantSubdomain={subdomain} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
