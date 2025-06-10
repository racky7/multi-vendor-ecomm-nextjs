import { Footer } from "@/modules/tenants/ui/components/footer";
import { Navbar } from "@/modules/checkout/ui/components/navbar";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { subdomain } = await params;

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
      <Navbar subdomain={subdomain} />
      <div className="flex-1 ">
        <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
