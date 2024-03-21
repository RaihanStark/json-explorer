import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { clearData } from "../actions/database";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ClearData() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  return (
    <>
      <Button color="danger" onPress={onOpenChange}>
        Clear Data
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
                Confirmation
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to clear all data? This action is
                  irreversible.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={async () => {
                    await clearData();
                    onClose();
                    toast.success("Data cleared successfully", {
                      duration: 7000,
                    });
                    router.refresh();
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
