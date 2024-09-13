import { LogOut } from "lucide-react";
import BaseButton from "./BaseButton";
import useLogout from "@/hooks/useLogout";
import { useToast } from "@/hooks/use-toast";

function LogoutButton() {
  const { isLoggingOut, logoutUser } = useLogout();

  const { toast } = useToast();

  function handleLogout() {
    logoutUser(
      {},
      {
        onError: (error) => {
          toast({
            title: error.name,
            description: error.message,
          });
        },
      },
    );
  }

  return (
    <BaseButton message="Logout" disabled={isLoggingOut} onClick={handleLogout}>
      <LogOut />
    </BaseButton>
  );
}

export default LogoutButton;
