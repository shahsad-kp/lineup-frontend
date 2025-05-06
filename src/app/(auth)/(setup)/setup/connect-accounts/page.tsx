import React from "react";
import {SetupTracker} from "@/app/(auth)/(setup)/setup/setupTracker";
import Image from "next/image";


export default async function SetupLayout() {
    return (
        <div className={'w-full'}>
            <SetupTracker totalSteps={4} currentStep={1}/>
            <div className={'w-full flex flex-col gap-3 mt-10 h-3 '}>
                <div className={'w-full flex flex-row gap-2'}>
                    <h4 className={'text-text-secondary font-medium'}>Connect your calendar accounts</h4>
                    <Image src={'/icons/info-icon.svg'} alt={'calendar'} width={18} height={18}/>
                </div>
                <div className={'w-full flex-col gap-2'}>

                </div>
            </div>
        </div>
    );
}