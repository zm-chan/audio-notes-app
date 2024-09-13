import { useQuery } from "@/context/QueryContext";
import { getNotes } from "@/services/apiFirebase";

function useFetchNotes() {
  const {
    isLoading,
    data: notesData,
    error,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });

  return { isLoading, notesData, error };
}

export default useFetchNotes;
