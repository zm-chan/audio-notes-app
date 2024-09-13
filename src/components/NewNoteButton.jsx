import { Plus } from "lucide-react";
import BaseButton from "./BaseButton";
import useCreateNote from "@/hooks/useCreateNote";
import { useToast } from "@/hooks/use-toast";

function NewNoteButton() {
  const { isCreating, createNote } = useCreateNote();
  const { toast } = useToast();

  function handleCreateNote() {
    createNote(
      {},
      {
        onError: (error) =>
          toast({ title: error.name, description: error.message }),
      },
    );
  }

  return (
    <BaseButton
      onClick={handleCreateNote}
      message="New Note"
      disabled={isCreating}
    >
      <Plus />
    </BaseButton>
  );
}

export default NewNoteButton;
