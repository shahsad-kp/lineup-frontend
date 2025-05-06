import {createContext} from "react";
import {AuthData} from "@/types/AuthData";

export const AuthContext = createContext<{
    authData: AuthData | null,
    setAuthData: (authData: AuthData | null) => void
}>({
    authData: null,
    setAuthData: () => {}
});