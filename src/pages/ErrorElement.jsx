import { Button } from "@/components/ui/button";
import { Link, useRouteError } from "react-router-dom";

function ErrorElement() {
  const error = useRouteError();

  //   console.log(error);
  //   QUESTION: Why error.data?
  //   console.log(error.data);

  let title = "An error occurred!";
  let message = "Something went wrong!";

  if (error.status === 500) {
    //   QUESTION: Why error.data?
    // message = JSON.parse(error.data).message;
    // message = error.data.message;
    message = error.message;
  }

  if (error.status === 404) {
    title = "Page Not found";
    message = "Could not find resource or page";
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-800">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-zinc-300 lg:text-4xl">
          {title}
        </h1>
        <p className="text-zinc-400 lg:text-2xl">{message}</p>
        <Button
          asChild
          className="bg-zinc-400 text-zinc-700 hover:bg-zinc-400/90 lg:px-4 lg:py-6 lg:text-lg"
        >
          <Link to={"/"}>Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default ErrorElement;
