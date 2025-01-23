import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children }) {
  const { user } = useUser();

  const navigate = useNavigate();
  const token = Cookies.get("auth-token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [user]);

  return <>{children}</>;
}
