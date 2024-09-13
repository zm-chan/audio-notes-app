import { useMutation, useQueryClient } from "@/context/QueryContext";
import { saveContent } from "@/services/apiFirebase";

function useSaveNoteContent() {
  const queryClient = useQueryClient();
  const { isLoading: isEditing, mutate: editNoteContent } = useMutation({
    mutationFn: ({ noteId, content }) => saveContent(content, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  return { isEditing, editNoteContent };
}

export default useSaveNoteContent;
