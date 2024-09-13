import { Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

function Loader({ className, ...props }) {
  return <Loader2 {...props} className={twMerge("animate-spin", className)} />;
}

export default Loader;
