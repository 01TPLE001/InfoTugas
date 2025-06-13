import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { API_URL } from "./utils/APIURL";
import { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const validateToken = async () => {
      try {
        await axios.post(`${API_URL}/user/auth/check_token?token=${token}`);
        setIsValid(true);
      } catch (error) {
        setIsValid(false);
        Cookies.remove("token");
      }
    };

    if (token) {
      validateToken();
    } else {
      setIsValid(false);
    }
  }, [token]);

  if (isValid === null) return <div>Loading...</div>;
  if (isValid === false) return <Navigate to="/" replace />;
  return children;
}