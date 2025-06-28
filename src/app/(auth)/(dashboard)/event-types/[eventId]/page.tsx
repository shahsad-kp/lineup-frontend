'use client';
import {Button, Divider, Input, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {useCallback, useEffect, useMemo, useState} from "react";
import {EventType} from "@/types";
import {getEventType, updateEventType} from "@/services/api";
import {DurationInput} from "@/app/(auth)/(dashboard)/event-types/[eventId]/durationInput";
import {EventTypeDurationOptional} from "@/types/eventTypes/eventTypeDurationOptional";
import {EventTypeLocationOptional} from "@/types/eventTypes/eventTypeLocationOptional";
import {LocationInput} from "@/app/(auth)/(dashboard)/event-types/[eventId]/locationInput";
import {areObjectsDifferent} from "@/services/utils/utilFunctions";

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

    const isDataUpdated = useMemo(() => {
        if (!eventType) return false;

        const dataUpdated = Object.keys(updatedData).some(key => {
            const typedKey = key as EventTypeStringKeys;
            return (
                updatedData[typedKey] !== undefined &&
                updatedData[typedKey] !== eventType[typedKey]
            );
        });
        if (dataUpdated) return true;

        if (durations.length !== eventType.durations.length) return true;
        for (let i = 0; i < durations.length; i++) {
            if (areObjectsDifferent(durations[i], eventType.durations[i])) return true;
        }

        if (locations.length !== eventType.locations.length) return true;
        for (let i = 0; i < locations.length; i++) {
            if (areObjectsDifferent(locations[i], eventType.locations[i])) return true;
        }

        return false;
    }, [durations, locations, eventType, updatedData]);


    const handleUndoChanges = useCallback(() => {
        setUpdatedData({});
        setDurations(eventType?.durations || []);
        setLocations(eventType?.locations || []);
    }, [eventType]);

    useEffect(() => {
        if (eventType) {
            setDurations(eventType.durations);
            setLocations(eventType.locations);
        }
    }, [eventType]);

    useEffect(() => {
        window.history.pushState(null, document.title, window.location.href)
        const handleRouteChange = () => {
            window.history.pushState(null, document.title, window.location.href)
        }
        window.addEventListener("popstate", handleRouteChange)

        return () => {
            window.removeEventListener("popstate", handleRouteChange)
        }
    }, [])

    const saveChanges = useCallback(() => {
        if (eventType) {
            updateEventType(
                eventType.id,
                {
                    name: updatedData.name || eventType.name,
                    description: updatedData.description || eventType.description,
                    visibility: updatedData.visibility || eventType.visibility,
                    pageUrl: updatedData.pageUrl || eventType.pageUrl,
                    durations: durations,
                    locations: locations
                }
            ).then(
                (eventType) => {
                    setUpdatedData({});
                    setEventType(eventType);
                }
            )
        }
    }, [durations, eventType, locations, updatedData.description, updatedData.name, updatedData.pageUrl, updatedData.visibility]);


    return (
        <Stack spacing={2} padding={2} sx={{width: '100%'}} paddingBottom={'5rem'} position={'relative'}>
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
            {
                isDataUpdated && (
                    <Stack
                        bottom={'1rem'}
                        right={'1rem'}
                        direction={'row'}
                        justifyContent={'end'}
                        position={'fixed'}
                        gap={2}
                    >
                        <Button variant={'plain'} onClick={handleUndoChanges}>
                            Undo Changes
                        </Button>
                        <Button onClick={saveChanges}>
                            Save Changes
                        </Button>
                    </Stack>
                )
            }
        </Stack>
    );
};