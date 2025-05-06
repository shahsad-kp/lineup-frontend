import React from "react";
import {AuthProvider} from "@/services/authContext/AuthProvider";

type Props = {
    children: React.ReactNode
}

export default function WithAuthLayout(props: Props) {

    return <>
        <main className={'w-full min-h-[calc(100vh-3.4rem)] bg-white rounded-3xl'}>
            <AuthProvider logoutUrl={'/auth/'}>
                {props.children}
            </AuthProvider>
        </main>
    </>
}