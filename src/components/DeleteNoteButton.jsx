import { Trash2 } from "lucide-react";
import BaseButton from "./BaseButton";
import useDeleteNote from "@/hooks/useDeleteNote";
import { useSelectedNote } from "@/context/SelectedNoteContext";
import { useToast } from "@/hooks/use-toast";

function DeleteNoteButton({ selectedNoteId }) {
  const { isDeleting, deleteNote } = useDeleteNote();
  const { deselectNote } = useSelectedNote();

  const { toast } = useToast();

  function handleDeleteNote() {
    deleteNote(
      { noteId: selectedNoteId },
      {
        onSuccess: deselectNote,
        onError: (error) =>
          toast({ title: error.name, description: error.message }),
      },
    );
  }

  return (
    <BaseButton
      onClick={handleDeleteNote}
      message="Delete Selected Note"
      disabled={isDeleting}
    >
      <Trash2 />
    </BaseButton>
  );
}

export default DeleteNoteButton;
