import { Badge, Input, Select, SelectItem } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Filter({ idNumber = 0, headers = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const [searchBy, setSearchBy] = useState(
    searchParams.get(`searchBy[${idNumber}]`) || "_id",
  );
  const [conditional, setConditional] = useState(
    searchParams.get(`conditional[${idNumber}]`) || "includes",
  );
  const [search, setSearch] = useState(
    searchParams.get(`search[${idNumber}]`) || "",
  );

  const updateParams = useDebouncedCallback(() => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set(`search[${idNumber}]`, search);
    currentParams.set(`searchBy[${idNumber}]`, searchBy);
    currentParams.set("page", 1);
    currentParams.set(`condition[${idNumber}]`, conditional);

    router.push(`${pathName}?${currentParams.toString()}`);
  }, 500);

  return (
    <Badge
      content={idNumber + 1}
      color="danger"
      placement="top-left"
      className="left-0"
    >
      <div className="flex gap-3">
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
      </div>
    </Badge>
  );
}
