import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { API_URL } from "./utils/APIURL";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "admin" | "user";
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        // ✅ GANTI axios.post MENJADI axios.get
        const res = await axios.get(`${API_URL}/user/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const verifiedRole = res.data?.data; // "user" atau "admin"
        Cookies.set("role", verifiedRole);

        if (role && verifiedRole !== role) {
          setIsValid(false);
        } else {
          setIsValid(true);
        }
      } catch {
        setIsValid(false);
        Cookies.remove("token");
        Cookies.remove("role");
      }
    };

    validate();
  }, [token, role]);

  if (isValid === null) return <div>Loading...</div>;
  if (!isValid) return <Navigate to="/" replace />;
  return <>{children}</>;
}
