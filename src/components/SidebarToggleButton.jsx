import { Columns2 } from "lucide-react";
import BaseButton from "./BaseButton";

function SidebarToggleButton({ ...props }) {
  return (
    <BaseButton {...props} message="Toggle Sidebar">
      <Columns2 />
    </BaseButton>
  );
}

export default SidebarToggleButton;
