import { useToast } from "@/hooks/use-toast";
import useSaveNote from "@/hooks/useSaveNote";
import { cn, dateFormatter } from "@/lib/utils";
import { Pin } from "lucide-react";

function Note({ note, isActive, ...props }) {
  const { editNote } = useSaveNote();

  const { id, title, lastEditTime, pinned } = note;
  const date = dateFormatter(lastEditTime);

  const { toast } = useToast();

  function handleSelectPinSvg(event) {
    if (event.target.closest("svg")) {
      event.stopPropagation();
      editNote(
        { noteId: id },
        {
          onError: (error) =>
            toast({ title: error.name, description: error.message }),
        },
      );
    }
  }

  return (
    <li
      {...props}
      className={cn("flex flex-col gap-2 border-b border-zinc-700 p-2", {
        "bg-zinc-700": isActive,
        "hover:bg-zinc-700": !isActive,
      })}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <Pin
          className={cn("h-4 w-4 text-slate-600", {
            "text-slate-50": pinned,
            "hover:text-slate-50": !pinned,
          })}
          onClick={handleSelectPinSvg}
        />
      </div>
      <span className="text-sm text-slate-400">{date}</span>
    </li>
  );
}

export default Note;
