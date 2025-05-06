import React from "react";
import Image from "next/image";
import FullLogoLight from "@/assets/images/Full Logo - light.svg";
import FullLogoDark from "@/assets/images/Full Logo.svg";

type Props = {
    children: React.ReactNode;
};

export default function SetupLayout(props: Props) {
    return (
        <div className={'h-screen w-screen bg-background items-center justify-center flex drop-shadow-2xl'}>
            <div className={'w-full h-full sm:h-fit sm:w-2/3 md:w-1/2 lg:w-120 sm:rounded-3xl bg-surface border-border flex flex-col p-10 gap-3'}>
                <Image
                    src={FullLogoLight}
                    alt="LineUp Logo"
                    className="block dark:hidden"
                    width={150}
                />
                <Image
                    src={FullLogoDark}
                    alt="LineUp Logo"
                    className="hidden dark:block"
                    width={150}
                />
                {props.children}
            </div>
        </div>
    )
}

