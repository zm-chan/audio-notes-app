import { useMutation } from "@/context/QueryContext";
import { loginFirebase } from "@/services/apiFirebase";

function useLogin() {
  const { isLoading: isLoggingIn, mutate: loginUser } = useMutation({
    mutationFn: loginFirebase,
  });
  return { isLoggingIn, loginUser };
}

export default useLogin;
