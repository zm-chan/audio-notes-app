import Note from "./Note";
import useFetchNotes from "@/hooks/useFetchNotes";
import Loader from "./Loader";

function NoteList({ selectNote, selectedNoteId }) {
  const { isLoading, error, notesData = [] } = useFetchNotes();

  function handleSetSelection(noteId) {
    selectNote(noteId);
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="h-10 w-10 text-white" />
      </div>
    );
  }

  if (!notesData || notesData.length === 0) {
    return (
      <ul className="flex h-full items-center justify-center">
        <span className="text-zinc-300">No Notes yet</span>
      </ul>
    );
  }

  if (error) {
    return (
      <ul className="flex h-full items-center justify-center">
        <span className="text-zinc-300">
          There&apos;s a problem loading notes. Please try to reload the page.
        </span>
      </ul>
    );
  }

  notesData.sort((a, b) => b.pinned - a.pinned);

  return (
    <ul>
      {notesData.map((note) => {
        return (
          <Note
            key={note.id}
            note={note}
            onClick={() => {
              handleSetSelection(note.id);
            }}
            isActive={note.id === selectedNoteId}
          />
        );
      })}
    </ul>
  );
}

export default NoteList;
