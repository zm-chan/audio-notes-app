import { useMutation } from "@/context/QueryContext";
import { logoutFirebase } from "@/services/apiFirebase";

function useLogout() {
  const { isLoading: isLoggingOut, mutate: logoutUser } = useMutation({
    mutationFn: logoutFirebase,
  });
  return { isLoggingOut, logoutUser };
}

export default useLogout;
