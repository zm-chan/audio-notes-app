import { StickyNote } from "lucide-react";
import BaseButton from "./BaseButton";

function NewTextContentButton({ ...props }) {
  return (
    <BaseButton {...props} message="New Text Content">
      <StickyNote />
    </BaseButton>
  );
}

export default NewTextContentButton;
