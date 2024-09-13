import { EllipsisVertical } from "lucide-react";
import BaseButton from "./BaseButton";
import { forwardRef } from "react";

const MenuButton = forwardRef(function MenuButton({ ...props }, ref) {
  return (
    <BaseButton ref={ref} {...props} message="Menu Buttons">
      <EllipsisVertical />
    </BaseButton>
  );
});

export default MenuButton;
