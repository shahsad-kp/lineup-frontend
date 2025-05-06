import React from "react";
import {SetupTracker} from "@/app/(auth)/(setup)/setup/setupTracker";

export default async function SetupLayout() {
    return (
        <div className={'w-full'}>
            <SetupTracker totalSteps={4} currentStep={2}/>
        </div>
    );
}