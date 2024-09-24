import { useEffect, useRef } from "react";
import TextNote from "./TextNote";
import VoiceSetup from "./VoiceSetup";

function NoteContent({
  temperoraryContent,
  handleUpdateEncryptContent,
  handleUpdateEditContent,
  handleUpdateSelectContent,
  handleAddNewAudioTextContent,
  isEditing,
  newNoteReference,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current && newNoteReference) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [newNoteReference]);

  temperoraryContent.sort((a, b) => {
    return a.createdAt - b.createdAt;
  });

  return (
    <>
      <div className="flex h-[calc(100vh-56px)] flex-col gap-9 overflow-scroll p-4">
        {temperoraryContent.map((eachContent) => {
          if (eachContent.type === "audio") {
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
      </div>
      <div ref={bottomRef}></div>
    </>
  );
}

export default NoteContent;
