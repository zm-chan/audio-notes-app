import { useQuery } from "@/context/QueryContext";
import { getContent } from "@/services/apiFirebase";

function useFetchNote(selectedNoteId) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["notes", selectedNoteId],
    queryFn: () => getContent(selectedNoteId),
  });
  return { isLoading, noteContent: data, error };
}

export default useFetchNote;
