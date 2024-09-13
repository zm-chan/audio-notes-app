import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { RemoteDataQueryProvider } from "./context/QueryContext";
import { SelectedNoteContextProvider } from "./context/SelectedNoteContext";
import { AuthContextProvider } from "./context/AuthContext";

import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import ErrorElement from "./pages/ErrorElement";

import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RemoteDataQueryProvider>
        <ProtectedRoute>
          <SelectedNoteContextProvider>
            <AppLayout />
          </SelectedNoteContextProvider>
        </ProtectedRoute>
      </RemoteDataQueryProvider>
    ),
    errorElement: <ErrorElement />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // This triggers the confirmation dialog in modern browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
