import { createContext, useContext, useRef, useState } from "react";

const SelectedNoteContext = createContext();

export function SelectedNoteContextProvider({ children }) {
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const editedRef = useRef(false);

  function selectNote(noteId) {
    if (editedRef.current) {
      if (
        noteId !== selectedNoteId &&
        window.confirm("Have you saved the note before leaving?")
      ) {
        editedRef.current = null;
        setSelectedNoteId(noteId);
      }
    } else {
      setSelectedNoteId(noteId);
    }
  }

  function deselectNote() {
    editedRef.current = null;
    setSelectedNoteId(null);
  }

  return (
    <SelectedNoteContext.Provider
      value={{ selectedNoteId, selectNote, deselectNote, editedRef }}
    >
      {children}
    </SelectedNoteContext.Provider>
  );
}

export function useSelectedNote() {
  const context = useContext(SelectedNoteContext);

  if (context === undefined) {
    throw new Error(
      "useSelectedNote was used outside of SelectedNoteContextProvider",
    );
  }

  return context;
}
