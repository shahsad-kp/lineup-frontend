'use client';
import React, {useCallback, useEffect, useState} from "react";
import {SetupTracker} from "@/app/(auth)/(setup)/setup/setupTracker";
import {useRouter} from "next/navigation";
import {CalendarAccount} from "@/types";
import {Button, List, ListItem, Option, Select} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {getCalendarSettings, getFullCalendars, updateCalendarSettings} from "@/services/api";

export default function SetupLayout() {
    const [calendarAccounts, setCalendarAccounts] = useState<CalendarAccount[]>([]);
    const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        getFullCalendars().then(calendarsAccounts => {
            setCalendarAccounts(
                calendarsAccounts
                    .map((account) => {
                        return {
                            ...account,
                            calendars: account.calendars?.filter(calendar => calendar.access === 'writer'),
                        };
                    })
                    .filter(account => account.calendars && account.calendars.length > 0)
            );
        });
        getCalendarSettings().then(settings => setSelectedCalendarId(settings.defaultEventCalendar));
    }, []);

    const handleChange = (
        _: React.SyntheticEvent | null,
        value: string | null,
    ) => {
        setSelectedCalendarId(value);
    };

    const saveAndNext = useCallback(() => {
        if (!selectedCalendarId) return;
        setIsLoading(true);
        updateCalendarSettings({
            defaultEventCalendar: selectedCalendarId,
        })
            .then(() => {
                router.push('/setup/conflict-calendars/');
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [router, selectedCalendarId]);

    return (
        <>
            <div>
                <SetupTracker totalSteps={4} currentStep={1}/>
                <div className={'w-full flex flex-col gap-3 mt-10'}>
                    <div className={'w-full flex flex-row gap-2'}>
                        <h4 className={'text-text-secondary font-medium'}>Select your default calendar</h4>
                    </div>
                    <div className={'w-full flex-col gap-2 flex'}>
                        <Select
                            placeholder="Select a calendar"
                            onChange={handleChange}
                            value={selectedCalendarId}
                        >
                            {calendarAccounts.map((account, index) => (
                                    <List
                                        key={index}
                                        aria-labelledby={`select-group-${account.id}`}
                                        sx={{'--ListItemDecorator-size': '28px'}}
                                    >
                                        <ListItem id={`select-group-${account.id}`} sticky>
                                            <Typography level="body-xs" sx={{textTransform: 'uppercase'}}>
                                                {account.name} ({account.calendars?.length})
                                            </Typography>
                                        </ListItem>
                                        {account.calendars?.map((calendar) => (
                                            <Option
                                                key={calendar.id}
                                                value={calendar.id}
                                                label={calendar.name}
                                            >
                                                {calendar.name}
                                            </Option>
                                        ))}
                                    </List>
                            ))}
                        </Select>
                    </div>
                    <div className={'w-full mt-3 flex flex-row justify-between'}>
                        <Button variant="solid" onClick={() => router.back()}>Back</Button>
                        <Button
                            variant="solid"
                            disabled={!Boolean(selectedCalendarId)}
                            loading={isLoading}
                            onClick={saveAndNext}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}