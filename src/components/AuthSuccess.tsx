import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");

    if (token && auth) {
      auth.login(token);
      navigate("/"); // or dashboard
    }
  }, [search, auth, navigate]);

  return <div>Signing you in...</div>;
}
