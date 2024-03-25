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
import { handleConfig, handleJSON, importJSON } from "../actions/database";

export default function ImportJSON() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [importedData, setImportedData] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isJsonValid, setIsJsonValid] = useState(false);
  const [progress, setProgress] = useState(0);
  const [maxProgress, setMaxProgress] = useState(0);

  const inputRef = useRef(null);

  useEffect(() => {
    // reset input value when modal is closed
    if (!isOpen && inputRef.current) {
      inputRef.current.value = "";
      setImportedData(null);
      setIsJsonValid(false);
    }
  }, [isOpen]);

  const importHandler = async () => {
    if (!importedData) {
      toast.error("No JSON file is selected! Please try again.", {
        duration: 7000,
      });
      return;
    }

    setIsImporting(true);
    setMaxProgress(importedData.length);
    setProgress(0);

    await handleConfig(importedData[0]);
    // Calculate chunk size
    const chunkSize = 4 * 1024 * 1024;

    let allChunks = [];

    let chunkObjects = [];

    for (let i = 1; i < importedData.length; i++) {
      chunkObjects.push(importedData[i]);
      if (JSON.stringify(chunkObjects).length > chunkSize) {
        allChunks.push(chunkObjects);
        setProgress(i);
        await importJSON(chunkObjects);
        chunkObjects = [];
      }
    }
    // await importedData.forEach(async (item) => {
    //   await importJSON(item);
    // });

    setIsImporting(false);
    toast.success("JSON is imported successfully! 🎉", {
      duration: 7000,
    });
    onOpenChange();
    router.refresh();
  };

  const handleFileOpen = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setIsImporting(true);
    reader.onload = (e) => {
      const data = e.target.result;
      let json_data;
      try {
        json_data = JSON.parse(data);
      } catch (error) {
        const repairedData = jsonrepair(data);
        const repairedDataJson = JSON.parse(repairedData);
        if (repairedDataJson) {
          console.log("repairedDataJson", repairedDataJson);
          setImportedData(repairedDataJson);
          setIsImporting(false);
          setIsJsonValid(true);
          return;
        }
        toast.error("Invalid JSON file! Please try again.", {
          duration: 7000,
        });
        setIsImporting(false);
        return;
      }

      setImportedData(json_data);
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
                  <Progress
                    color="primary"
                    className="my-3"
                    label="Importing..."
                    maxValue={maxProgress}
                    value={progress}
                    formatOptions={{
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }}
                    valueLabel={progress + "/" + maxProgress}
                    showValueLabel={true}
                  />
                )}
                {(isJsonValid &&
                 !isImporting) ? (
                    <div>
                      <p className="text-sm text-green-500">
                        JSON is valid and ready to import! Please click the
                        import button.
                      </p>
                    </div>,
                 ) : null}
                {isImporting && (
                  <div>
                    <p className="text-sm text-red-500">
                      Do not close the site while the JSON is being imported...
                    </p>
                  </div>,
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
                    await importHandler();
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
