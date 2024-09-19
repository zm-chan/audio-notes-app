import { twMerge } from "tailwind-merge";
import ContentContainer from "./ContentContainer";
import SidebarToggleButton from "./SidebarToggleButton";

function Content({ className, selectedNoteId, handleToggleSidebar }) {
  let content = (
    <>
      <div className="sticky top-0 z-10 bg-zinc-800 px-4 py-2 sm:hidden">
        <SidebarToggleButton onClick={handleToggleSidebar} />
      </div>
      <div className="flex min-h-56 items-center justify-center px-4 text-center text-xl text-zinc-300">
        Select A Note Or Create A Note By Pressing The Sidebar Button
      </div>
    </>
  );

  if (selectedNoteId) {
    content = (
      <ContentContainer
        key={selectedNoteId}
        selectedNoteId={selectedNoteId}
        handleToggleSidebar={handleToggleSidebar}
      />
    );
  }

  return (
    <div className={twMerge("overflow-auto", className)} id="contentIdentifier">
      {content}
    </div>
  );
}

export default Content;
