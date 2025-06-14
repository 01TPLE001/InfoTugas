// ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { API_URL } from "./utils/APIURL";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const [isValid, setIsValid] = useState<boolean | null>(null);
//   const token = Cookies.get("token");

//   useEffect(() => {
//     const validateToken = async () => {
//       try {
//         await axios.post(
//           `${API_URL}/user/auth/check_token`,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setIsValid(true);
//       } catch (error) {
//         setIsValid(false);
//         Cookies.remove("token");
//       }
//     };

//     if (token) {
//       validateToken();
//     } else {
//       setIsValid(false);
//     }
//   }, [token]);

//   if (isValid === null) return <div>Loading...</div>;
//   if (isValid === false) return <Navigate to="/" replace />;
//   return children;
// }

// versi JS Cookies

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/", { replace: true });
    } else {
      setChecked(true); 
    }
  }, [navigate]);

  if (!checked) return null; 

  return <>{children}</>;
}
