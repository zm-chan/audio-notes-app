import { twMerge } from "tailwind-merge";

function Sidebar({ className, children, ...props }) {
  return (
    <aside className={twMerge("overflow-auto", className)} {...props}>
      {children}
    </aside>
  );
}

export default Sidebar;
