import { useRef, useState } from "react";
import MarkDownEditor from "./MarkDownEditor";
import EncryptionDialog from "./EncryptionDialog";
import { debounce, decryptContent, encryptContent } from "@/lib/utils";
import SelectButton from "./SelectButton";

function TextNote({
  eachContent,
  handleUpdateEncryptContent,
  handleUpdateEditContent,
  handleUpdateSelectContent,
}) {
  const markdownRef = useRef(null);

  const [openDialog, setOpenDialog] = useState(false);

  const debouncedHandleEditContent = debounce(function handleEditContent() {
    const markdownContent = markdownRef.current.getMarkdown();
    handleUpdateEditContent(eachContent.id, markdownContent);
  }, 1000);

  function handleEncryptContent(secretKey) {
    if (eachContent.encrypted === false) {
      const encryptedContent = encryptContent(secretKey, eachContent.textValue);
      handleUpdateEncryptContent(eachContent.id, encryptedContent);
      setOpenDialog(false);
    } else {
      const decryptedContent = decryptContent(secretKey, eachContent.textValue);
      handleUpdateEncryptContent(eachContent.id, decryptedContent);
      setOpenDialog(false);
    }
  }

  function handleSelectContent() {
    handleUpdateSelectContent(eachContent.id);
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1">
        <SelectButton
          selected={eachContent.selected}
          onClick={handleSelectContent}
        />
        <EncryptionDialog
          handleEncryptContent={handleEncryptContent}
          encrypted={eachContent.encrypted}
          openDialog={openDialog}
          handleDialog={setOpenDialog}
        />
      </div>

      <MarkDownEditor
        key={Date.now()}
        ref={markdownRef}
        content={eachContent.textValue}
        debouncedHandleEditContent={debouncedHandleEditContent}
      />
    </div>
  );
}

export default TextNote;
