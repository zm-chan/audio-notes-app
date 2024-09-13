import { useMutation, useQueryClient } from "@/context/QueryContext";
import { deleteSelectedNote } from "@/services/apiFirebase";

function useDeleteNote() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteNote } = useMutation({
    mutationFn: ({ noteId }) => deleteSelectedNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  return { isDeleting, deleteNote };
}

export default useDeleteNote;
