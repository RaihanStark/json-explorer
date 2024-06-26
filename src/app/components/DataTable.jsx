"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
  Pagination,
  Select,
  SelectItem,
} from "@nextui-org/react";

import { lazy, useEffect, useState } from "react";
import { deleteItem, updateItem } from "../actions/database";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const ReactJson = lazy(() => import("react-json-view"));
export default function DataTable({
  headers,
  items,
  currentPage,
  currentLimit,
  totalItems,
  totalPages,
  pageMeta,
}) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const columns = headers;
  const rows = items.map((item) => Object.values(item));

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onOpenChange: onOpenChangeAdd,
  } = useDisclosure();

  const [selectedItem, setSelectedItem] = useState(null);

  const [updatedItem, setUpdatedItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [limit, setLimit] = useState(new Set([`${currentLimit}`]));

  const replaceUrl = (page, limit = 5) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("page", page);
    currentParams.set("limit", limit);

    router.push(`${pathName}?${currentParams.toString()}`);
  };

  return (
    <>
      <Table
        isHeaderSticky
        onRowAction={(key) => {
          setSelectedItem(items[key]);
          onOpen();
        }}
        aria-label="Example collection static table"
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column}>{column}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              className="transition-all duration-150 ease-in-out hover:cursor-pointer hover:bg-gray-100"
            >
              {row.map((cell, index) => (
                <TableCell key={index}>
                  <div
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                      overflow: "hidden",
                    }}
                  >
                    {JSON.stringify(cell)}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="my-5 flex justify-between items-center">
        <Pagination
          showControls
          showShadow
          page={parseInt(currentPage)}
          total={totalPages}
          onChange={(page) => {
            replaceUrl(page, currentLimit);
          }}
        ></Pagination>

        <div className="flex items-center gap-5">
          <Select
            label="Entries Per Page"
            labelPlacement="outside-left"
            size="sm"
            selectionMode="single"
            selectedKeys={limit}
            defaultSelectedKeys={limit}
            onSelectionChange={setLimit}
            onChange={(e) => {
              replaceUrl(currentPage, e.target.value);
            }}
            className="min-w-[150px]"
          >
            <SelectItem value={5} key={5}>
              5
            </SelectItem>
            <SelectItem value={10} key={10}>
              10
            </SelectItem>
            <SelectItem value={20} key={20}>
              20
            </SelectItem>
            <SelectItem value={50} key={50}>
              50
            </SelectItem>
            <SelectItem value={100} key={100}>
              100
            </SelectItem>
          </Select>
          <div className="text-nowrap max-w-[500px] w-full">
            {pageMeta} of {totalItems}
          </div>
        </div>
      </div>

      <Modal
        size="2xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior={"inside"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detail Information
              </ModalHeader>
              <ModalBody>
                <ReactJson
                  name={false}
                  onEdit={(newJson) => {
                    setUpdatedItem(newJson);
                  }}
                  onAdd={(newJson) => {
                    setUpdatedItem(newJson);
                  }}
                  onDelete={(newJson) => {
                    setUpdatedItem(newJson);
                  }}
                  src={selectedItem}
                  enableClipboard={false}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={async () => {
                    setIsDeleting(true);
                    await deleteItem(selectedItem._id);
                    toast.success("Item deleted successfully", {
                      duration: 7000,
                    });
                    onClose();
                    router.refresh();
                    setIsDeleting(false);
                  }}
                  isLoading={isDeleting}
                >
                  Delete
                </Button>
                <Button
                  color="warning"
                  onPress={async () => {
                    setIsUpdating(true);

                    const updatedItemWithoutId = updatedItem.updated_src;
                    delete updatedItemWithoutId._id;

                    const id = updatedItem.existing_src._id;

                    await updateItem(id, updatedItemWithoutId);

                    router.refresh();
                    setIsUpdating(false);
                    toast.success("Item updated successfully", {
                      duration: 7000,
                    });
                    setUpdatedItem(null);
                  }}
                  isDisabled={!updatedItem}
                  isLoading={isUpdating}
                >
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
