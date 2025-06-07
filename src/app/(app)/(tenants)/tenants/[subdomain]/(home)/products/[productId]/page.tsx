import { ProductView } from "@/modules/tenants/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

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
      <ProductView productId={productId} tenantSubdomain={subdomain} />
    </HydrationBoundary>
  );
};

export default Page;
