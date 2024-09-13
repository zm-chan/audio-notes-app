import { useState } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import useSaveTitle from "@/hooks/useSaveTitle";
import { useToast } from "@/hooks/use-toast";

function NoteTitle({ noteId, noteTitle }) {
  const [isFocused, setIsFocused] = useState(false);

  const [value, setValue] = useState(() => {
    const strippedTitle = noteTitle.split(".")[0];

    return strippedTitle;
  });

  const { isEditing, editNoteTitle } = useSaveTitle();
  const { toast } = useToast();

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (value !== noteTitle.split(".")[0]) {
      editNoteTitle(
        { noteId: noteId, title: value },
        {
          onError: (error) => {
            toast({
              title: error.name,
              description: error.message,
            });
            setValue(noteTitle);
          },
        },
      );
    }
  };

  const handleChange = (e) => {
    if (isFocused) {
      setValue(e.target.value);
    }
  };

  return (
    <Input
      type="text"
      disabled={isEditing}
      value={value}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      readOnly={!isFocused}
      className={cn(
        "max-w-[60vw] overflow-x-auto rounded-none border-0 bg-transparent text-lg font-medium text-white caret-white focus-visible:border-b focus-visible:border-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0 md:overflow-visible",
      )}
    />
  );
}

export default NoteTitle;
