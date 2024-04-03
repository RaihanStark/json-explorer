"use client";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import ImportJSON from "./ImportJSON";
import ClearData from "./ClearData";
import AddItem from "./AddItem";
import Filter from "./Filter";
import ExportJSON from "./ExportJSON";

export default function HeaderActions({ headers, headersWithType }) {
  return (
    <>
      <div className="my-5 flex items-center justify-between gap-3">
        {headers.length > 0 && (
          <div className="flex flex-col gap-3">
            <Filter idNumber={0} headers={headers} />
            <Filter idNumber={1} headers={headers} />
          </div>
        )}
        <div className="flex items-center gap-3">
          {headers.length > 0 && <AddItem headersWithType={headersWithType} />}
          <ImportJSON />
          <ExportJSON />
          <ClearData />
        </div>
      </div>
    </>
  );
}
