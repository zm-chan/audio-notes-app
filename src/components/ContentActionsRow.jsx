import DeleteContentButton from "./DeleteContentButton";
import MenuButton from "./MenuButton";
import NewAudioContentButton from "./NewAudioContentButton";
import NewTextContentButton from "./NewTextContentButton";
import NoteTitle from "./NoteTitle";
import SaveButton from "./SaveButton";
import SidebarToggleButton from "./SidebarToggleButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function ContentActionsRow({
  noteId,
  noteTitle,
  handleDeleteContent,
  handleAddNewAudioContent,
  handleAddNewTextContent,
  handleSaveContent,
  handleToggleSidebar,
  isEditing,
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-6 bg-zinc-800 px-4 py-2">
      <div className="flex grow">
        <SidebarToggleButton
          onClick={handleToggleSidebar}
          className="sm:hidden"
        />
        <NoteTitle noteId={noteId} noteTitle={noteTitle} />
      </div>
      <div className="hidden items-center justify-evenly gap-3 md:flex">
        <NewAudioContentButton
          onClick={handleAddNewAudioContent}
          disabled={isEditing}
        />
        <NewTextContentButton
          onClick={handleAddNewTextContent}
          disabled={isEditing}
        />
        <SaveButton onClick={handleSaveContent} disabled={isEditing} />
        <DeleteContentButton
          onClick={handleDeleteContent}
          disabled={isEditing}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="md:hidden">
          <MenuButton />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex bg-zinc-800 p-0 shadow-none focus:[&>div]:bg-transparent">
          <DropdownMenuItem>
            <NewAudioContentButton
              onClick={handleAddNewAudioContent}
              disabled={isEditing}
            />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <NewTextContentButton
              onClick={handleAddNewTextContent}
              disabled={isEditing}
            />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SaveButton onClick={handleSaveContent} disabled={isEditing} />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DeleteContentButton
              onClick={handleDeleteContent}
              disabled={isEditing}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ContentActionsRow;
