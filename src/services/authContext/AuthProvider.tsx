'use client';
import {AuthContext} from "@/services/authContext/authContext";
import React, {useEffect, useMemo, useState} from "react";
import {getAuthData} from "@/services/api";
import {useRouter} from "next/navigation";
import {AuthData} from "@/types";
import {maskEmail} from "@/services/utils/emailUtils";

type Props = {
    children: React.ReactNode,
    logoutUrl?: string
}

export const AuthProvider = ({children, logoutUrl}: Props) => {
    const [authData, setAuthData] = useState<AuthData | null>(null);
    const router = useRouter();

    useEffect(() => {
        getAuthData()
            .then(data => {
                setAuthData(data);
            })
            .catch(() => {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                if (logoutUrl)
                    router.push(logoutUrl);
            });
    }, [logoutUrl, router]);


    const value = useMemo(() => {
        return {authData, setAuthData};
    }, [authData]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};