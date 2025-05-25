'use client';
import React from "react";
import {SetupTracker} from "@/app/(auth)/(setup)/setup/setupTracker";
import {Button} from "@mui/joy";
import {useRouter} from "next/navigation";
import {getCalendarSettings} from "@/services/api";

export default function SetupLayout() {
    const router = useRouter();

    getCalendarSettings().then(settings => console.log(settings));

    return (
        <div className={'w-full'}>
            <SetupTracker totalSteps={4} currentStep={3}/>
            <div className={'w-full flex flex-col gap-3 mt-10'}>
                <div className={'w-full flex flex-row gap-2'}>
                    <h4 className={'text-text-secondary font-medium'}>Adjust your default availability</h4>
                </div>
                <div className={'max-h-55 overflow-y-auto w-full flex flex-col gap-2'}>
                </div>
                <div className={'w-full mt-3 flex flex-row justify-between'}>
                    <Button variant="solid" onClick={() => router.back()}>Back</Button>
                    <Button
                        variant="solid"
                    >
                        Next
                    </Button>
                </div>
            </div>

        </div>
    );
}