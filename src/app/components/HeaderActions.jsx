"use client";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import ImportJSON from "./ImportJSON";
import ClearData from "./ClearData";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AddItem from "./AddItem";

export default function HeaderActions({ headers, headersWithType }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const [searchBy, setSearchBy] = useState(
    searchParams.get("searchBy") || "_id",
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [value] = useDebounce(search, 500);

  const updateParams = () => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("search", value);
    currentParams.set("searchBy", searchBy);

    router.replace(`${pathName}?${currentParams.toString()}`);
  };

  useEffect(() => {
    updateParams();
  }, [value, updateParams, searchBy]);

  return (
    <>
      <div className="my-5 flex items-center justify-between gap-3">
        <div className="flex gap-3">
          {headers.length > 0 && (
            <>
              <Select
                label="Search by"
                defaultSelectedKeys={["_id"]}
                size="sm"
                className="min-w-[10rem]"
                onChange={(e) => setSearchBy(e.target.value)}
                selectedKeys={[searchBy]}
              >
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="Search"
                size="sm"
                className="w-full min-w-[15rem]"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {headers.length > 0 && <AddItem headersWithType={headersWithType} />}
          <ImportJSON />
          <ClearData />
        </div>
      </div>
    </>
  );
}
