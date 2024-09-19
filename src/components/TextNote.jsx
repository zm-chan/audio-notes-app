import { useRef, useState } from "react";
import MarkDownEditor from "./MarkDownEditor";
import EncryptionDialog from "./EncryptionDialog";
import { decryptContent, encryptContent } from "@/lib/utils";
import SelectButton from "./SelectButton";

function TextNote({
  eachContent,
  handleUpdateEncryptContent,
  handleUpdateEditContent,
  handleUpdateSelectContent,
  isEditing,
}) {
  const markdownRef = useRef(null);

  const [openDialog, setOpenDialog] = useState(false);

  function handleEditContent() {
    const markdownContent = markdownRef.current.getMarkdown();
    handleUpdateEditContent(eachContent.id, markdownContent);
  }

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
          disabled={isEditing}
        />
        <EncryptionDialog
          handleEncryptContent={handleEncryptContent}
          encrypted={eachContent.encrypted}
          openDialog={openDialog}
          handleDialog={setOpenDialog}
          disabled={isEditing}
        />
      </div>

      <MarkDownEditor
        key={Date.now()}
        ref={markdownRef}
        content={eachContent.textValue}
        handleEditContent={handleEditContent}
      />
    </div>
  );
}

export default TextNote;
