'use client';
import React, {useEffect, useState} from "react";
import {SetupTracker} from "@/app/(auth)/(setup)/setup/setupTracker";
import {Button, Checkbox, List, ListItem} from "@mui/joy";
import {useRouter} from "next/navigation";
import {Calendar} from "@/types";
import {getCalendarSettings} from "@/services/api";
import {getCalendars} from "@/services/api/calendar";

export default function SetupLayout() {
    const [calendars, setCalendars] = useState<Calendar[]>([]);
    const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
    const [defaultEventCalendarId, setDefaultEventCalendarId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        getCalendars().then(calendars => setCalendars(calendars));
        getCalendarSettings().then(settings => {
            setDefaultEventCalendarId(settings.defaultEventCalendar);
            setSelectedCalendars([settings.defaultEventCalendar]);
        });
    }, []);

    return (
        <div className={'w-full'}>
            <SetupTracker totalSteps={4} currentStep={2}/>
            <div className={'w-full flex flex-col gap-3 mt-10'}>
                <div className={'w-full flex flex-row gap-2'}>
                    <h4 className={'text-text-secondary font-medium'}>Select your default conflict calendars</h4>
                </div>
                <div className={'max-h-55 overflow-y-auto w-full flex flex-col gap-2'}>
                    <List size={'md'}>
                        {calendars.map((account) => (
                            <ListItem key={account.id}>
                                <Checkbox
                                    label={account.name}
                                    disabled={account.id === defaultEventCalendarId}
                                    checked={selectedCalendars.includes(account.id)}
                                    onChange={(event) => {
                                        const isChecked = event.target.checked;
                                        setSelectedCalendars(prev => {
                                            if (isChecked) {
                                                return [...prev, account.id];
                                            } else {
                                                return prev.filter(id => id !== account.id);
                                            }
                                        });
                                    }}
                                    color={'primary'}
                                    sx={{
                                        '& .MuiCheckbox-label': {
                                            color: 'white',
                                        }
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>

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