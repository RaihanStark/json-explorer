import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  useDisclosure,
} from "@nextui-org/react";
import { jsonrepair } from "jsonrepair";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { handleJSON } from "../actions/database";

export default function ImportJSON() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [importedData, setImportedData] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isJsonValid, setIsJsonValid] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    // reset input value when modal is closed
    if (!isOpen && inputRef.current) {
      inputRef.current.value = "";
      setImportedData(null);
      setIsJsonValid(false);
    }
  }, [isOpen]);

  const handleFileOpen = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setIsImporting(true);
    reader.onload = (e) => {
      const data = e.target.result;
      setImportedData(data);
      setIsImporting(false);
      setIsJsonValid(true);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Button color="warning" onPress={onOpen}>
        Import JSON
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
                Import JSON
              </ModalHeader>
              <ModalBody>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileOpen}
                  disabled={isImporting}
                />
                {isImporting && (
                  <Progress isIndeterminate color="primary" className="my-3" />
                )}
                {isJsonValid && (
                  <div>
                    <p className="text-sm text-green-500">
                      JSON is valid and ready to import! Please click the import
                      button.
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  isDisabled={!importedData}
                  isLoading={isImporting}
                  onPress={async () => {
                    setIsImporting(true);
                    await handleJSON(importedData);
                    setIsImporting(false);
                    toast.success("JSON is imported successfully! 🎉", {
                      duration: 7000,
                    });
                    onOpenChange();
                    router.refresh();
                  }}
                >
                  Import
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
