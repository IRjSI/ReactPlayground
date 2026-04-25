import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/authContext";
import { getUserAPI } from "../services/API";
import { UserProps } from "../types/types";

export function useUser() {
  const { token } = useContext(AuthContext) as AuthContextType;

  const { data: userInfo, isLoading: loadingUser } = useQuery<UserProps>({
    queryKey: ["user"],
    queryFn: getUserAPI,
    enabled: !!token,
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });

  return { userInfo, loadingUser };
}