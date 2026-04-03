import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextType } from "../context/authContext";
import { UserProps } from "../types/types";

export function useUser() {
  const [userInfo, setUser] = useState<UserProps>();
  const [loadingUser, setLoadingUser] = useState(true);
  const { token } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    if (!token) {
      setLoadingUser(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/user/get-user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data.data))
      .finally(() => setLoadingUser(false));
  }, [token]);

  return { userInfo, loadingUser };
}