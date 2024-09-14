import Content from "@/components/Content";
import Sidebar from "@/components/Sidebar";
import SidebarButtonsRow from "@/components/SidebarButtonsRow";
import NoteList from "@/components/NoteList";
import { useSelectedNote } from "@/context/SelectedNoteContext";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function AppLayout() {
  const { selectedNoteId, selectNote } = useSelectedNote();
  const [toggleSidebar, setToggleSidebar] = useState(false);

  function handleToggleSidebar() {
    setToggleSidebar((prevToggle) => {
      return !prevToggle;
    });
  }

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // This triggers the confirmation dialog in modern browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <main className="grid grid-cols-[auto_auto] sm:grid-cols-[auto_1fr]">
        <Sidebar
          className={cn(
            "-ml-64 w-64 overflow-y-auto border-r bg-zinc-900 transition-all duration-300 ease-in-out xs:-ml-80 xs:w-80 sm:ml-0 sm:w-80",
            {
              "!ml-0": toggleSidebar,
            },
          )}
        >
          <SidebarButtonsRow selectedNoteId={selectedNoteId} />
          <NoteList selectNote={selectNote} selectedNoteId={selectedNoteId} />
        </Sidebar>
        <Content
          className="w-screen bg-zinc-800 sm:w-auto"
          selectedNoteId={selectedNoteId}
          handleToggleSidebar={handleToggleSidebar}
        />
      </main>
      <Toaster />
    </>
  );
}

export default AppLayout;
