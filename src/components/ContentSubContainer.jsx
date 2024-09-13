import ContentActionsRow from "./ContentActionsRow";
import NoteContent from "./NoteContent";
import { useCallback, useState } from "react";
import { useSelectedNote } from "@/context/SelectedNoteContext";
import useSaveNoteContent from "@/hooks/useSaveNoteContent";
import { checkAudioSupport } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

function ContentSubContainer({ noteContent, handleToggleSidebar }) {
  const [temperoraryContent, setTemperoraryContent] = useState(
    noteContent.content || [],
  );

  const { editedRef } = useSelectedNote();

  const { isEditing, editNoteContent } = useSaveNoteContent();

  const { toast } = useToast();

  function handleAddNewAudioContent() {
    // console.log("handleAddNewAudioContent");
    // console.log(checkAudioSupport());
    if (!checkAudioSupport()) {
      toast({
        title: "Error",
        description: "Your browser has no support of audio",
      });
    } else {
      editedRef.current = true;
      setTemperoraryContent((previousTemperoraryContent) => {
        const createdAt = Date.now();
        return [
          ...previousTemperoraryContent,
          {
            id: createdAt,
            createdAt: createdAt,
            type: "audio",
            selected: false,
            recorded: false,
          },
        ];
      });
    }
  }

  const handleAddNewAudioTextContent = useCallback(
    function handleAddNewAudioTextContent(
      contentId,
      audioUrl,
      audioFile,
      transcript,
    ) {
      // console.log("handleAddNewAudioTextContent");
      editedRef.current = true;
      setTemperoraryContent((previousTemperoraryContent) => {
        const addedAudioContent = previousTemperoraryContent.map(
          (eachContent) => {
            if (eachContent.id === contentId) {
              return {
                ...eachContent,
                audioUrl: audioUrl,
                audioFile: audioFile,
                recorded: true,
              };
            } else {
              return eachContent;
            }
          },
        );

        const createdAt = Date.now();

        const addedAudioTextContent = [
          ...addedAudioContent,
          {
            id: createdAt,
            createdAt: createdAt,
            type: "text",
            selected: false,
            encrypted: false,
            textValue: transcript,
            audioId: contentId,
          },
        ];

        return addedAudioTextContent;
      });
    },
    [editedRef],
  );

  function handleAddNewTextContent() {
    // console.log("handleAddNewTextContent");
    editedRef.current = true;
    setTemperoraryContent((previousTemperoraryContent) => {
      const createdAt = Date.now();
      return [
        ...previousTemperoraryContent,
        {
          id: createdAt,
          createdAt: createdAt,
          type: "text",
          selected: false,
          encrypted: false,
          textValue: "",
          audioId: null,
        },
      ];
    });
  }

  function handleDeleteContent() {
    // console.log("handleDeleteContent");
    editedRef.current = true;
    const selectedContent = temperoraryContent.some((eachContent) => {
      return eachContent.selected === true;
    });

    // console.log(selectedContent);

    if (!selectedContent) {
      return;
    }

    const removeSelectedContent = temperoraryContent.filter((eachContent) => {
      return eachContent.selected !== true;
    });

    // revoke audioUrl
    temperoraryContent.forEach((eachContent) => {
      if (eachContent.type === "audio" && eachContent.audioUrl) {
        return URL.revokeObjectURL(eachContent.audioUrl);
      }
    });

    // remove audio and text content link
    const removeAudioLinkedTextContent = removeSelectedContent.map(
      (eachContent) => {
        if (eachContent.type === "text" && eachContent.audioId) {
          return { ...eachContent, audioId: null };
        } else {
          return eachContent;
        }
      },
    );

    setTemperoraryContent(removeAudioLinkedTextContent);
  }

  function handleUpdateSelectContent(contentId) {
    // console.log("handleUpdateSelectContent");
    setTemperoraryContent((prevTemperoraryContent) => {
      return prevTemperoraryContent.map((eachContent) => {
        if (eachContent.id === contentId) {
          return {
            ...eachContent,
            selected: !eachContent.selected,
          };
        } else {
          return eachContent;
        }
      });
    });
  }

  function handleUpdateEditContent(contentId, content) {
    // console.log("handleUpdateEditContent");
    editedRef.current = true;
    setTemperoraryContent((prevTemperoraryContent) => {
      return prevTemperoraryContent.map((eachContent) => {
        if (eachContent.id === contentId) {
          return {
            ...eachContent,
            textValue: content,
          };
        } else {
          return eachContent;
        }
      });
    });
  }

  function handleUpdateEncryptContent(contentId, content) {
    // console.log("handleUpdateEncryptContent");
    editedRef.current = true;
    setTemperoraryContent((prevTemperoraryContent) => {
      return prevTemperoraryContent.map((eachContent) => {
        if (eachContent.id === contentId) {
          return {
            ...eachContent,
            textValue: content,
            encrypted: !eachContent.encrypted,
          };
        } else {
          return eachContent;
        }
      });
    });
  }

  function handleSaveContent() {
    const containsVoiceSetup = temperoraryContent.some((eachContent) => {
      return eachContent.type === "audio" && eachContent.recorded === false;
    });

    if (containsVoiceSetup) {
      return toast({
        title: "Error",
        description: "You have un-recorded audio pending",
      });
    }

    editNoteContent(
      { noteId: noteContent.id, content: temperoraryContent },
      {
        onSuccess: () => {
          editedRef.current = false;
        },
        onError: (error) =>
          toast({ title: error.name, description: error.message }),
      },
    );
  }

  return (
    <>
      <ContentActionsRow
        noteId={noteContent.id}
        noteTitle={noteContent.title}
        handleDeleteContent={handleDeleteContent}
        handleAddNewAudioContent={handleAddNewAudioContent}
        handleAddNewTextContent={handleAddNewTextContent}
        handleSaveContent={handleSaveContent}
        handleToggleSidebar={handleToggleSidebar}
        isEditing={isEditing}
      />
      <NoteContent
        temperoraryContent={temperoraryContent}
        handleUpdateEncryptContent={handleUpdateEncryptContent}
        handleUpdateEditContent={handleUpdateEditContent}
        handleUpdateSelectContent={handleUpdateSelectContent}
        handleAddNewAudioTextContent={handleAddNewAudioTextContent}
      />
    </>
  );
}

export default ContentSubContainer;
