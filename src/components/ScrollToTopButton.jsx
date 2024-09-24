import { ArrowUpFromLine } from "lucide-react";
import { Button } from "./ui/button";

function ScrollToTopButton() {
  return (
    <Button
      size="icon"
      className="fixed bottom-4 right-4 z-10 h-9 w-9 border-0 bg-zinc-300 hover:bg-zinc-300/90 lg:h-10 lg:w-10"
      onClick={() =>
        document
          .getElementById("noteContentIdentifier")
          .scrollTo({ top: 0, left: 0, behavior: "smooth" })
      }
    >
      <ArrowUpFromLine className="h-5 w-5 text-zinc-800 lg:h-6 lg:w-6" />
    </Button>
  );
}

export default ScrollToTopButton;
