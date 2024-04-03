import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { lazy, useEffect, useState } from "react";
import { addItem } from "../actions/database";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";

const ReactJson = lazy(() => import("react-json-view"));

export default function AddItem({ headersWithType }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const parseHeaders = (headersObj) => {
    const newObj = {};
    for (let prop in headersObj) {
      if (headersObj.hasOwnProperty(prop)) {
        if (headersObj[prop] === "array") {
          newObj[prop] = [];
        } else if (headersObj[prop] === "boolean") {
          newObj[prop] = false;
        } else if (headersObj[prop] === "number") {
          newObj[prop] = 0;
        } else if (headersObj[prop] === "string") {
          newObj[prop] = "";
        }
      }
    }
    return newObj;
  };

  const [forms, setForms] = useState(null);

  useEffect(() => {
    if (forms !== null) return;
    setForms(parseHeaders(headersWithType));
  }, [forms, headersWithType]);

  return (
    <div>
      <Button color="primary" onPress={onOpen} startContent={<FaPlus />}>
        Add Item
      </Button>
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
                Create New Item
              </ModalHeader>
              <ModalBody>
                <ReactJson
                  src={forms}
                  enableClipboard={false}
                  onEdit={(e) => {
                    setForms(e.updated_src);
                  }}
                  onAdd={(e) => {
                    setForms(e.updated_src);
                  }}
                  onDelete={(e) => {
                    setForms(e.updated_src);
                  }}
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={async () => {
                    const totalHeaders = Object.keys(headersWithType).length;
                    const totalForms = Object.keys(forms).length;

                    if (totalHeaders !== totalForms) {
                      toast.error(
                        "Do not remove any fields! Please refresh the page and try again.",
                      );
                      return;
                    }

                    const result = await addItem(forms);
                    if (result.acknowledged) {
                      onClose();
                      toast.success("Item added successfully");
                      router.refresh();
                    }
                  }}
                >
                  Add Item
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
