import { useRef } from "react";
import EncryptionButton from "./EncryptionButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

function EncryptionDialog({
  handleEncryptContent,
  encrypted,
  openDialog,
  handleDialog,
}) {
  const inputRef = useRef(null);

  function handleSecretKey() {
    const secretKey = inputRef.current.value;

    handleEncryptContent(secretKey);
  }

  return (
    <Dialog open={openDialog} onOpenChange={handleDialog}>
      <DialogTrigger asChild>
        <EncryptionButton encrypted={encrypted} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Secret Key</DialogTitle>
          <DialogDescription>
            Type in your secret key to encrypt or decrypt your content.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="secret-key" className="text-right">
              Secret Key
            </Label>
            <Input
              id="secret-key"
              className="col-span-3"
              ref={inputRef}
              autocomplete="off"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSecretKey}>
            {encrypted ? "Decrypt" : "Encrypt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EncryptionDialog;
