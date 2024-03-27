"use client";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import ImportJSON from "./ImportJSON";
import ClearData from "./ClearData";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AddItem from "./AddItem";
import { useDebouncedCallback } from "use-debounce";

export default function HeaderActions({ headers, headersWithType }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const [searchBy, setSearchBy] = useState(
    searchParams.get("searchBy") || "_id",
  );
  const [conditional, setConditional] = useState(
    searchParams.get("conditional") || "includes",
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const updateParams = useDebouncedCallback(() => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("search", search);
    currentParams.set("searchBy", searchBy);
    currentParams.set("page", 1);
    currentParams.set("condition", conditional);

    router.push(`${pathName}?${currentParams.toString()}`);
  }, 500);

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
                onChange={(e) => {
                  setSearchBy(e.target.value);
                  updateParams();
                }}
                selectedKeys={[searchBy]}
              >
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Condition"
                defaultSelectedKeys={["includes"]}
                size="sm"
                className="min-w-[10rem]"
                selectedKeys={[conditional]}
                onChange={(e) => {
                  setConditional(e.target.value);
                  updateParams();
                }}
              >
                <SelectItem value="includes" key="includes">
                  include
                </SelectItem>
                <SelectItem value="excludes" key="excludes">
                  exclude
                </SelectItem>
              </Select>

              <Input
                label="Search"
                size="sm"
                className="w-full min-w-[15rem]"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  updateParams();
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
