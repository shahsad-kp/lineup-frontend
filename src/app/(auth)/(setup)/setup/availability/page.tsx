'use client';
import React, {useCallback, useEffect, useState} from "react";
import {SetupTracker} from "@/app/(auth)/(setup)/setup/setupTracker";
import {Button, Divider, IconButton, Stack} from "@mui/joy";
import {useRouter} from "next/navigation";
import {
    createAvailabilityCalendar,
    createConflictCalendar,
    getAvailabilityCalendar,
    getCalendarSettings,
    setDefaultConflictCalendar,
    updateConflictCalendar
} from "@/services/api";
import Typography from "@mui/joy/Typography";
import AddIcon from '@mui/icons-material/Add';
import {StartAndEndTime} from "@/components/startAndEndTime";
import {WeeklyAvailability} from "@/types";
import {TimeString, WeekDay} from "@/types/times";


export default function SetupLayout() {
    const [weeklyAvailability, setWeeklyAvailability] = useState<WeeklyAvailability>({
        sunday: [],
        monday: [
            {
                start: '09:00',
                end: '17:00',
            },
        ],
        tuesday: [
            {
                start: '09:00',
                end: '17:00',
            }
        ],
        wednesday: [
            {
                start: '09:00',
                end: '17:00',
            }
        ],
        thursday: [
            {
                start: '09:00',
                end: '17:00',
            }
        ],
        friday: [
            {
                start: '09:00',
                end: '17:00',
            }
        ],
        saturday: [
            {
                start: '09:00',
                end: '17:00',
            }
        ],
    });
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const setAvailability = useCallback((weekday: WeekDay, updatingIndex: number, startOrEnd: 'start' | 'end', time: TimeString) => {
        setWeeklyAvailability(
            prevState => {
                const updatedSlots = prevState[weekday].map((slot, index) => {
                    if (index === updatingIndex) {
                        return {
                            ...slot,
                            [startOrEnd]: time
                        };
                    }
                    return slot;
                });

                return {
                    ...prevState,
                    [weekday]: updatedSlots
                };
            }
        )
    }, []);

    useEffect(() => {
        getCalendarSettings()
            .then(settings => {
                if (settings && settings.defaultAvailabilityCalendar)
                    getAvailabilityCalendar(settings.defaultAvailabilityCalendar)
                        .then(availability => {
                            if (availability) {
                                setWeeklyAvailability(availability.weeklyAvailability);
                            }
                        });
            })
    }, []);

    const saveAndNext = useCallback(() => {
        setIsLoading(true);
        if (defaultConflictCalendar.current) {
            updateConflictCalendar(
                defaultConflictCalendar.current,
                selectedCalendars
            )
                .then(() => router.push('/'))
                .finally(() => setIsLoading(false));
        } else {
            createAvailabilityCalendar(weeklyAvailability)
                .then(conflictCalendar => {
                    setDefaultConflictCalendar(conflictCalendar.id)
                        .then(() => {
                            router.push('/');
                        })
                        .catch(error => {
                            console.error('Error updating conflict calendar:', error);
                        })
                        .finally(() => {
                            setIsLoading(false);
                        })
                })
        }
    }, [router]);

    return (
        <div className={'w-full'}>
            <SetupTracker totalSteps={4} currentStep={3}/>
            <div className={'w-full flex flex-col gap-3 mt-10'}>
                <div className={'w-full flex flex-row gap-2'}>
                    <h4 className={'text-text-secondary font-medium'}>Adjust your default availability</h4>
                </div>
                <Stack direction={'column'} maxHeight={'30vh'} overflow={'auto'} gap={2} sx={{padding: '10px'}}>
                    {Object.entries(weeklyAvailability).map(([day, slots]) => (
                        <Stack key={day} direction={'column'} gap={2} sx={{alignItems: 'center'}}>
                            {day !== 'sunday' && <Divider sx={{marginTop: '10px'}}/>}
                            <Typography
                                level="body-md"
                                sx={{color: 'white'}}
                                width={'100%'}
                            >
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                            </Typography>
                            <Stack dir={'column'} gap={1} sx={{width: 'fit-content'}} justifyContent={'center'}>
                                {
                                    slots.map(
                                        (slot, index) => (
                                            <StartAndEndTime
                                                key={`${index}-${day}`}
                                                startTime={slot.start}
                                                endTime={slot.end}
                                                setStartTime={(time) => setAvailability(day as WeekDay, index, 'start', time)}
                                                setEndTime={(time) => setAvailability(day as WeekDay, index, 'end', time)}
                                            />
                                        )
                                    )

                                }
                                <IconButton
                                    aria-label="Open add more"
                                    variant={'soft'}
                                    onClick={
                                        () => setWeeklyAvailability(prevState => ({
                                            ...prevState,
                                            [day as WeekDay]: [
                                                ...prevState[day as WeekDay],
                                                {start: '09:00', end: '17:00'}
                                            ]
                                        }))
                                    }
                                    sx={{
                                        width: '100%',
                                        paddingX: '3rem',
                                    }}
                                >
                                    <AddIcon/>
                                </IconButton>
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
                <div className={'w-full mt-3 flex flex-row justify-between'}>
                    <Button variant="solid" onClick={() => router.back()}>Back</Button>
                    <Button
                        variant="solid"
                        onClick={saveAndNext}
                    >
                        Next
                    </Button>
                </div>
            </div>

        </div>
    );
}