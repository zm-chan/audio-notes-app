import DeleteNoteButton from "./DeleteNoteButton";
import LogoutButton from "./LogoutButton";
import NewNoteButton from "./NewNoteButton";

function SidebarButtonsRow({ selectedNoteId }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-700 px-3 py-2">
      <LogoutButton />
      <div>
        <NewNoteButton />
        <DeleteNoteButton selectedNoteId={selectedNoteId} />
      </div>
    </div>
  );
}

export default SidebarButtonsRow;
