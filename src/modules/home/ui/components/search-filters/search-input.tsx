
import { Input } from "@/components/ui/input";
import { BookMarkedIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Props {
  disabled?: boolean;
  data: CategoriesGetManyOutput;
  defaultValue?: string | undefined;
  onChange?: (value: string | undefined) => void;
}

export const SearchInput = ({ defaultValue, onChange, disabled, data }: Props) => {
  const [searchValue, setSearchValue] = useState(defaultValue)
  const [sidebarOpen, setIsSidebarOpen] = useState(false);

  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());


  useEffect(() => {
    const timeOutId = setTimeout(() => {
      onChange?.(searchValue)
    }, 300)
    return () => {
      clearTimeout(timeOutId);
    };
  }, [searchValue, onChange])

  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar
        data={data}
        open={sidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          className="pl-8"
          placeholder="Search Products"
          disabled={disabled}
          defaultValue={defaultValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
      </div>
      <Button
        variant="elevated"
        className="size-12 shrink-0 flex lg:hidden"
        onClick={() => {
          setIsSidebarOpen(true);
        }}
      >
        <ListFilterIcon />
      </Button>

      {session.data?.user && (
        <Button variant="elevated" asChild>
          <Link prefetch href={"/library"}>
            <BookMarkedIcon />
            Library
          </Link>
        </Button>
      )}
    </div>
  );
};
