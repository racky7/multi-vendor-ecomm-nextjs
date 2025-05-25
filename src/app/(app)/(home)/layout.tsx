import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SearchFilters } from "./search-filters";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Category } from "@/payload-types";
import { CustomCategory } from "./types";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1,
    where: {
      parent: {
        exists: false,
      },
    },
    pagination: false,
    sort: "name",
  });

  const formattedData: CustomCategory[] = data.docs.map((category) => ({
    ...category,
    subcategories: (category.subcategories?.docs ?? []).map((subcategory) => ({
      // Because of depth 1, we are confident that subcategories will be a type of Category
      ...(subcategory as Category),
    })),
  }));

  console.log({ data, formattedData });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#F4F4F0]"> {children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
