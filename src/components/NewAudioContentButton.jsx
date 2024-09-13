import { FileVolume } from "lucide-react";
import BaseButton from "./BaseButton";

function NewAudioContentButton({ ...props }) {
  return (
    <BaseButton {...props} message="New Voice Content">
      <FileVolume />
    </BaseButton>
  );
}

export default NewAudioContentButton;
