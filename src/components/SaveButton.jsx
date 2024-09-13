import { Router } from "lucide-react";
import BaseButton from "./BaseButton";

function SaveButton({ ...props }) {
  return (
    <BaseButton {...props} message="Save To Web">
      <Router />
    </BaseButton>
  );
}

export default SaveButton;
