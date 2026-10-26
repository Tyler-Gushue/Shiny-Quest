import { createContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { refreshSession, logoutUser } from "../api/auth";

export type User = {
    id: string;
    username: string;
    email: string;
};

export type AuthContextType = {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    function setAuth(newUser: User, token: string) {
        setUser(newUser);
        setAccessToken(token);
    }

    async function logout() {
        try {
            await logoutUser();
        } finally {
            setUser(null);
            setAccessToken(null);
        }
    }

    const hasCheckedSession = useRef(false);

    useEffect(() => {

        if (hasCheckedSession.current) return;
        hasCheckedSession.current = true;

        refreshSession()
            .then((data) => {
                setUser(data.user);
                setAccessToken(data.accessToken);
            })
            .catch(() => {
                // no valid cookie = nobody logged in, nothing to do
            })
            .finally(() => {
                setIsLoading(false);
            });

    }, []);

    return (
        <AuthContext.Provider value={{ user, accessToken, isLoading, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );

}