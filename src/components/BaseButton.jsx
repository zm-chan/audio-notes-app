import { twMerge } from "tailwind-merge";
import { Button } from "./ui/button";
import { forwardRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const BaseButton = forwardRef(function BaseButton(
  { children, className, message, ...props },
  ref,
) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            size="icon"
            // [&_svg]:h-5 [&_svg]:w-5
            className={twMerge(
              "bg-transparent hover:bg-zinc-700 [&_svg]:text-zinc-300",
              className,
            )}
            {...props}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

export default BaseButton;
