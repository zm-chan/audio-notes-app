import { useEffect, useRef } from "react";
import TextNote from "./TextNote";
import VoiceNote from "./VoiceNote";
import VoiceSetup from "./VoiceSetup";
import { useSelectedNote } from "@/context/SelectedNoteContext";

function NoteContent({
  temperoraryContent,
  handleUpdateEncryptContent,
  handleUpdateEditContent,
  handleUpdateSelectContent,
  handleAddNewAudioTextContent,
  isEditing,
}) {
  const bottomRef = useRef(null);

  const { selectedNoteId } = useSelectedNote();

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedNoteId]);

  const sortedTemperoraryContent = temperoraryContent.sort((a, b) => {
    return a.createdAt - b.createdAt;
  });

  return (
    <div className="flex flex-col gap-9 px-4 py-2">
      {sortedTemperoraryContent.map((eachContent) => {
        if (eachContent.type === "audio" && eachContent.recorded) {
          return (
            <VoiceNote
              key={eachContent.id}
              eachContent={eachContent}
              handleUpdateSelectContent={handleUpdateSelectContent}
            />
          );
        } else if (eachContent.type === "audio" && !eachContent.recorded) {
          return (
            <VoiceSetup
              key={eachContent.id}
              eachContent={eachContent}
              handleUpdateSelectContent={handleUpdateSelectContent}
              handleAddNewAudioTextContent={handleAddNewAudioTextContent}
            />
          );
        } else {
          return (
            <TextNote
              key={eachContent.id}
              eachContent={eachContent}
              handleUpdateEncryptContent={handleUpdateEncryptContent}
              handleUpdateEditContent={handleUpdateEditContent}
              handleUpdateSelectContent={handleUpdateSelectContent}
              isEditing={isEditing}
            />
          );
        }
      })}
      <div ref={bottomRef}></div>
    </div>
  );
}

export default NoteContent;
