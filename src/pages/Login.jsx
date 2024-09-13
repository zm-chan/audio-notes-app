import { useUser } from "@/context/AuthContext";
import useLogin from "@/hooks/useLogin";
import { Navigate, useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function Login() {
  const navigate = useNavigate();

  const { userState } = useUser();

  const { isLoggingIn, loginUser } = useLogin();

  const { toast } = useToast();

  if (userState) {
    return <Navigate to="/" />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    loginUser(
      { email, password },
      {
        onSuccess: () => {
          navigate("/");
        },
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
    <main className="flex min-h-screen items-center justify-center bg-zinc-800">
      <form
        onSubmit={handleSubmit}
        className="grid w-5/6 max-w-xs gap-y-5 rounded-2xl bg-zinc-700 px-4 py-6 text-center sm:max-w-sm sm:gap-y-7 sm:px-6 sm:py-8 lg:max-w-md lg:px-8 lg:py-10"
      >
        <h2 className="text-xl font-semibold text-zinc-300 sm:text-2xl lg:text-3xl">
          Login Form
        </h2>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          className="h-9 border-zinc-400 bg-transparent text-sm text-zinc-300 ring-offset-zinc-400 focus-visible:ring-transparent sm:py-5 sm:text-base lg:h-12 lg:text-lg"
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          className="h-9 border-zinc-400 bg-transparent text-sm text-zinc-300 ring-offset-zinc-400 focus-visible:ring-transparent sm:py-5 sm:text-base lg:h-12 lg:text-lg"
        />
        <Button
          type="submit"
          disabled={isLoggingIn}
          className="bg-zinc-400 capitalize text-zinc-700 hover:bg-zinc-400/90 sm:py-5 sm:text-base lg:py-6 lg:text-lg"
        >
          Login
        </Button>
      </form>
    </main>
  );
}

export default Login;
