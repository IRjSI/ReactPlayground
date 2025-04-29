import { createContext, ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export type AuthContextType = {
    isLoggedIn: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function ContextProvider({ children }: { children: ReactElement }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const navigate = useNavigate();
    
    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setIsLoggedIn(true);
        setToken(newToken);
    }
    
    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setToken(null);
        navigate('/');
    }

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setIsLoggedIn(true);
            setToken(storedToken);
        }
    }, [])

    const contextValue: AuthContextType = {
        token,
        isLoggedIn,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}