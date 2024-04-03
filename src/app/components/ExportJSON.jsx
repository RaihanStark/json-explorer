import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { BiExport } from "react-icons/bi";
import { downloadJSON } from "../actions/database";
import { useState } from "react";

export default function ExportJSON() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [filename, setFilename] = useState("exported");

  const searchParams = useSearchParams();

  return (
    <>
      <Button color="warning" startContent={<BiExport />} onPress={onOpen}>
        Export JSON
      </Button>

      <Modal isOpen={isOpen} size="2xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Export JSON
              </ModalHeader>
              <ModalBody>
                <p>
                  Please enter the filename for the JSON file you want to
                  export.
                </p>
                <Input
                  label="Filename"
                  onValueChange={setFilename}
                  value={filename}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" isDisabled={isLoading} onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  isLoading={isLoading}
                  onPress={async () => {
                    setIsLoading(true);
                    let params = {};

                    searchParams.forEach((value, key) => {
                      params[key] = value;
                    });

                    const download_json = await downloadJSON(params);
                    setIsLoading(false);

                    if (download_json) {
                      onClose();

                      // download file from download_json (url json to download)
                      const link = document.createElement("a");
                      link.href = download_json;

                      // promp name for file
                      link.download = `${filename || "exported"}.json`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                >
                  Export
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
