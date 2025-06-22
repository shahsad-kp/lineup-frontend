'use client';
import {Divider, Input, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {useCallback, useEffect, useState} from "react";
import {EventType} from "@/types";
import {getEventType} from "@/services/api";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {EventTypeDuration} from "@/types/eventTypes";

type Props = {
    params: Promise<{
        eventId: string
    }>
}

type EventTypeStringKeys = Exclude<{
    [K in keyof EventType]: EventType[K] extends string | undefined ? K : never
}[keyof EventType], 'durations'>;

type EventTypeDurationOptional = Omit<EventTypeDuration, 'id'> & { id?: string };


export default function EventTypeIndividualPage(props: Props) {
    const [eventType, setEventType] = useState<EventType | null>(null);
    const [updatedData, setUpdatedData] = useState<Partial<EventType>>({});
    const [expandedDurations, setExpandedDurations] = useState<boolean>(false);
    const [durations, setDurations] = useState<EventTypeDurationOptional[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const {eventId} = await props.params;
            const data = await getEventType(eventId);
            setEventType(data);
            console.log('Event ID:', eventId);
        };

        loadData();
    }, [props.params]);

    const setData = useCallback((key: EventTypeStringKeys, value: string) => {
        setUpdatedData(prevState => ({
            ...prevState,
            [key]: value,
        }));
    }, []);

    const getData = useCallback((key: EventTypeStringKeys): string => {
        if (updatedData[key] !== undefined) return updatedData[key] as string;
        return eventType?.[key] as string ?? '';
    }, [eventType, updatedData]);

    const convertMinutes = useCallback((minutes: number, short: boolean) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (short) {
            return `${hours <= 9? '0' : ''}${hours}:${mins}`;
        }
        if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''}`;
        }
        return `${mins} minute${mins > 1 ? 's' : ''}`;
    }, []);


    const updateDuration = useCallback((value: string, index?: number) => {
        const match = /^(\d{1,2}):(\d{2})$/.exec(value);
        if (!match) return;

        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const totalMinutes = hours * 60 + minutes;
        setDurations(prev => {
            const updated = [...prev];
            if (index !== undefined && index >= 0 && index < updated.length) {
                updated[index].duration = totalMinutes;
            } else {
                updated.push({
                    duration: totalMinutes,
                    isDefault: false,
                });
            }
            return updated;
        });
    }, []);

    return (
        <Stack spacing={2} padding={2} sx={{width: '100%'}}>
            <Typography level={'h3'}>EVENT TYPE</Typography>
            <Stack direction={'column'} gap={2}>
                <Input
                    placeholder={'name' in updatedData ? 'Event type title...' : ''}
                    value={getData('name')}
                    sx={{
                        marginBottom: '1rem',
                        padding: '0.5rem 0',
                        border: '0',
                        background: 'transparent',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        '&::before': {
                            display: 'none',
                        },
                        '&:focus-within': {
                            outline: 'none',
                            outlineOffset: '2px',
                        },
                    }}
                    fullWidth={true}
                    onChange={(event) => setData('name', event.target.value)}
                />
                <Divider/>
                <Stack
                    component={'button'}
                    direction={'row'}
                    justifyContent={'space-between'}
                    onClick={() => setExpandedDurations(!expandedDurations)}
                    width={'100%'}
                    color={'white'}
                    padding={'0.5rem 0'}
                    sx={{
                        cursor: 'pointer',
                    }}
                >
                    <Typography level={'h4'}>Durations</Typography>
                    <ArrowDropDownIcon
                        sx={{
                            transform: expandedDurations ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                        }}
                    />
                </Stack>
                <Stack
                    component={'li'}
                    direction={'column'}
                >
                    {
                        eventType?.durations?.map((duration, index) => {
                            return (
                                <Stack
                                    key={index}
                                    direction={'row'}
                                    alignItems="center"
                                    justifyContent={'space-between'}
                                    padding={'0.5rem 0'}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                    }}
                                >
                                    <Input
                                        type="text"
                                        value={convertMinutes(duration.duration, true)}
                                        onChange={(e) => updateDuration(e.target.value, index)}
                                        sx={{
                                            maxWidth: 100,
                                            fontSize: '1rem',
                                            background: 'transparent',
                                            color: 'white',
                                            '& input': {
                                                padding: 0,
                                                textAlign: 'right',
                                            },
                                            '&::before': {display: 'none'},
                                        }}
                                        placeholder={'HH:MM'}
                                    />
                                    <Typography level={'body-sm'}>
                                        {duration.isDefault ? 'Default' : 'Custom'}
                                    </Typography>
                                </Stack>

                            );
                        })
                    }
                </Stack>
                <Divider/>
            </Stack>
        </Stack>
    );
};