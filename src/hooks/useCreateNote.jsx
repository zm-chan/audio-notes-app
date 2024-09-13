import { useMutation, useQueryClient } from "@/context/QueryContext";
import { createEmptyNote } from "@/services/apiFirebase";

function useCreateNote() {
  const queryClient = useQueryClient();
  const { isLoading: isCreating, mutate: createNote } = useMutation({
    mutationFn: createEmptyNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  return { isCreating, createNote };
}

export default useCreateNote;
