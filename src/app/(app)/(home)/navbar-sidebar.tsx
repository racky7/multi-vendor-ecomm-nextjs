import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface Props {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export const NavbarSidebar = ({ open, onOpenChange, items }: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center">
            <SheetTitle>Menu</SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-full p-4 text-left hover:bg-black hover:text-white
                flex items-center text-base font-medium"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              {item.children}
            </Link>
          ))}
          <div className="border-t">
            <Link
              href={"/sign-in"}
              onClick={() => {
                onOpenChange(false);
              }}
              className="w-full p-4 text-left hover:bg-black hover:text-white
                flex items-center text-base font-medium"
            >
              Sign in
            </Link>
            <Link
              href={"/sign-up"}
              onClick={() => {
                onOpenChange(false);
              }}
              className="w-full p-4 text-left hover:bg-black hover:text-white
                flex items-center text-base font-medium"
            >
              Start selling
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
