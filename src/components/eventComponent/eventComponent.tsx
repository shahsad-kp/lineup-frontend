import {Button, Divider, Input, Stack} from '@mui/joy';
import * as React from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {LocationInput} from '../locationInput/locationInput';
import {DurationInput} from "@/components/durationInput/durationInput";
import {EventType} from '@/types';
import {EventTypeLocationOptional} from "@/types/eventTypes/eventTypeLocationOptional";
import {EventTypeDurationOptional} from "@/types/eventTypes/eventTypeDurationOptional";
import {areObjectsDifferent} from "@/services/utils/utilFunctions";
import {createEventType, updateEventType} from "@/services/api";
import {useRouter} from "next/navigation";

type Props = {
    eventType: EventType;
    setEventType: (eventType: EventType) => void;
};

type EventTypeStringKeys = Exclude<{
    [K in keyof EventType]: EventType[K] extends string | undefined ? K : never
}[keyof EventType], 'durations'>;

export const EventComponent = (props: Props) => {
    const [updatedData, setUpdatedData] = useState<Partial<EventType>>({});
    const [durations, setDurations] = useState<EventTypeDurationOptional[]>([]);
    const [locations, setLocations] = useState<EventTypeLocationOptional[]>([]);
    const router = useRouter();


    const {eventType, setEventType} = props;

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
            if (eventType.durations.length === 0)
                setDurations([{
                    duration: 30,
                    isDefault: true
                }]);
            else
                setDurations(eventType.durations);
            if (eventType.locations.length === 0)
                setLocations([{
                    locationType: 'call',
                    isDefault: true,
                    address: '',
                    requireInviteeNumber: true,
                    phoneNumber: ''
                }]);
            else
                setLocations(eventType.locations);
        }
    }, [eventType]);

    const saveChanges = useCallback(() => {
        if (eventType) {
            if (eventType.id === 'new')
                createEventType({
                    name: updatedData.name || eventType.name,
                    description: updatedData.description || eventType.description,
                    visibility: updatedData.visibility || eventType.visibility,
                    pageUrl: updatedData.pageUrl || eventType.pageUrl,
                    durations: durations,
                    locations: locations
                }).then(
                    (eventType) => {
                        router.replace('/event-types/' + eventType.id);
                    }
                )
            else
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
    }, [durations, eventType, locations, router, setEventType, updatedData.description, updatedData.name, updatedData.pageUrl, updatedData.visibility]);


    return (
        <>
            <Stack direction={'column'} gap={2}>
                <Input
                    placeholder={'name' in updatedData || eventType?.id === 'new' ? 'Event type title...' : ''}
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
        </>
    );
};