import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { RemoteDataQueryProvider } from "./context/QueryContext";
import { SelectedNoteContextProvider } from "./context/SelectedNoteContext";
import { AuthContextProvider } from "./context/AuthContext";

import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import ErrorElement from "./pages/ErrorElement";

import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";

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
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthContextProvider>
  );
}

export default App;
