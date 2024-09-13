import useFetchNote from "@/hooks/useFetchNote";
import ContentSubContainer from "./ContentSubContainer";
import Loader from "./Loader";

function ContentContainer({ selectedNoteId, handleToggleSidebar }) {
  const { isLoading, noteContent = [], error } = useFetchNote(selectedNoteId);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="h-16 w-16 text-white" />
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <>
      <ContentSubContainer
        noteContent={noteContent}
        handleToggleSidebar={handleToggleSidebar}
      />
    </>
  );
}

export default ContentContainer;
