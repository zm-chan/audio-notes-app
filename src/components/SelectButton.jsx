import { Square, SquareCheck } from "lucide-react";
import BaseButton from "./BaseButton";

function SelectButton({ selected, ...props }) {
  return (
    <BaseButton {...props}>
      {selected ? <SquareCheck /> : <Square />}
    </BaseButton>
  );
}

export default SelectButton;
