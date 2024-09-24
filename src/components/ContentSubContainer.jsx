import ContentActionsRow from "./ContentActionsRow";
import NoteContent from "./NoteContent";
import { useCallback, useRef, useState } from "react";
import { useSelectedNote } from "@/context/SelectedNoteContext";
import useSaveNoteContent from "@/hooks/useSaveNoteContent";
import { checkAudioSupport } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ScrollToTopButton from "./ScrollToTopButton";

function ContentSubContainer({ noteContent, handleToggleSidebar }) {
  const [temperoraryContent, setTemperoraryContent] = useState(
    noteContent.content || [],
  );

  const { editedRef } = useSelectedNote();

  const { isEditing, editNoteContent } = useSaveNoteContent();

  const { toast } = useToast();

  const newNoteRef = useRef("");

  function handleAddNewAudioContent() {
    // console.log("handleAddNewAudioContent");
    // console.log(Boolean(checkAudioSupport()));

    try {
      if (checkAudioSupport()) {
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
            },
          ];
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Your browser has no support of audio",
      });
    }
  }

  const handleAddNewAudioTextContent = useCallback(
    function handleAddNewAudioTextContent(contentId, transcript) {
      // console.log("handleAddNewAudioTextContent");
      editedRef.current = true;
      setTemperoraryContent((previousTemperoraryContent) => {
        const removedVoiceSetup = previousTemperoraryContent.filter(
          (eachContent) => {
            return eachContent.id !== contentId;
          },
        );

        const createdAt = Date.now();

        const addedTextContentFromAudio = [
          ...removedVoiceSetup,
          {
            id: createdAt,
            createdAt: createdAt,
            type: "text",
            selected: false,
            encrypted: false,
            textValue: transcript,
          },
        ];

        return addedTextContentFromAudio;
      });
    },
    [editedRef],
  );

  function handleAddNewTextContent() {
    // console.log("handleAddNewTextContent");
    editedRef.current = true;
    const createdAt = Date.now();
    setTemperoraryContent((previousTemperoraryContent) => {
      return [
        ...previousTemperoraryContent,
        {
          id: createdAt,
          createdAt: createdAt,
          type: "text",
          selected: false,
          encrypted: false,
          textValue: "",
        },
      ];
    });
    newNoteRef.current = createdAt;
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

    const removedSelectedContent = temperoraryContent.filter((eachContent) => {
      return eachContent.selected !== true;
    });

    setTemperoraryContent(removedSelectedContent);
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

    if (contentId === newNoteRef.current) {
      newNoteRef.current = "";
    }
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
      return eachContent.type === "audio";
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
        isEditing={isEditing}
        newNoteReference={newNoteRef.current}
      />
      <ScrollToTopButton />
    </>
  );
}

export default ContentSubContainer;
