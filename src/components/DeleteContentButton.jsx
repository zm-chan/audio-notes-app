import { Eraser } from "lucide-react";
import BaseButton from "./BaseButton";

function DeleteContentButton({ ...props }) {
  return (
    <BaseButton {...props} message="Delete Selected Content">
      <Eraser />
    </BaseButton>
  );
}

export default DeleteContentButton;
