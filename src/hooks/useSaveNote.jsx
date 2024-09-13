import { useMutation, useQueryClient } from "@/context/QueryContext";
import { saveNotePinStatus } from "@/services/apiFirebase";

function useSaveNote() {
  const queryClient = useQueryClient();
  const { isLoading: isEditing, mutate: editNote } = useMutation({
    mutationFn: saveNotePinStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  return { isEditing, editNote };
}

export default useSaveNote;
