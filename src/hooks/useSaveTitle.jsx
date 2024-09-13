import { useMutation, useQueryClient } from "@/context/QueryContext";
import { saveTitle } from "@/services/apiFirebase";

function useSaveTitle() {
  const queryClient = useQueryClient();
  const { isLoading: isEditing, mutate: editNoteTitle } = useMutation({
    mutationFn: ({ noteId, title }) => saveTitle(title, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  return { isEditing, editNoteTitle };
}

export default useSaveTitle;
