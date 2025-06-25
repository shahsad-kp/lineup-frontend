'use client';
import {Divider, Input, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {useCallback, useEffect, useState} from "react";
import {EventType} from "@/types";
import {getEventType} from "@/services/api";
import {DurationInput} from "@/app/(auth)/(dashboard)/event-types/[eventId]/durationInput";
import {EventTypeDurationOptional} from "@/types/eventTypes/eventTypeDurationOptional";
import {EventTypeLocationOptional} from "@/types/eventTypes/eventTypeLocationOptional";
import {LocationInput} from "@/app/(auth)/(dashboard)/event-types/[eventId]/locationInput";

type Props = {
    params: Promise<{
        eventId: string
    }>
}

type EventTypeStringKeys = Exclude<{
    [K in keyof EventType]: EventType[K] extends string | undefined ? K : never
}[keyof EventType], 'durations'>;



export default function EventTypeIndividualPage(props: Props) {
    const [eventType, setEventType] = useState<EventType | null>(null);
    const [updatedData, setUpdatedData] = useState<Partial<EventType>>({});
    const [durations, setDurations] = useState<EventTypeDurationOptional[]>([]);
    const [locations, setLocations] = useState<EventTypeLocationOptional[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const {eventId} = await props.params;
            return await getEventType(eventId);
        };
        loadData().then(data => {
            setEventType(data);
            setDurations(data.durations);
            setLocations(data.locations);
        });
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
                <Stack direction={'row'} justifyContent={'space-between'} width={'100%'} gap={'2rem'}>
                    <DurationInput durations={durations} setDurations={setDurations}/>
                    <LocationInput locations={locations} setLocations={setLocations}/>
                </Stack>
            </Stack>
        </Stack>
    );
};