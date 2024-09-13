import { useUser } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { userState } = useUser();

  if (!userState) {
    return <Navigate to={"/login"} />;
  }

  return children;
}

export default ProtectedRoute;
