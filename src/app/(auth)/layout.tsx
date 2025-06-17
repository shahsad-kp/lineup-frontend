import React from "react";
import {AuthProvider} from "@/services/authContext/AuthProvider";

type Props = {
    children: React.ReactNode
}

export default function WithAuthLayout(props: Props) {
    return <>
        <div className={'w-full h-full flex flex-col'}>
            <AuthProvider logoutUrl={'/auth/'}>
                {props.children}
            </AuthProvider>
        </div>
    </>
}