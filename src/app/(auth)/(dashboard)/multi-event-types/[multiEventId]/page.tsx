'use client';
import {Button, Input, Stack, Textarea} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import * as React from "react";
import {useCallback, useEffect, useMemo, useState} from "react";
import {MultiEventType} from "@/types";
import {getMultiEventType} from "@/services/api";
import {useRouter} from "next/navigation";
import EventsList from "@/app/(auth)/(dashboard)/multi-event-types/[multiEventId]/eventsList";
import {MultiEventConnection} from "@/types/multiEventTypes/multiEventConnection";

type Props = {
    params: Promise<{
        multiEventId: string
    }>
}

type MultiEventTypeStringKeys = keyof MultiEventType

export default function MultiEventTypeIndividualPage(props: Props) {
    const [multiEventType, setMultiEventType] = useState<MultiEventType | null>(null);
    const [updatedData, setUpdatedData] = useState<Partial<MultiEventType>>({});

    const router = useRouter();

    useEffect(() => {
        async function loadEventType(): Promise<MultiEventType> {
            const {multiEventId} = await props.params;
            if (multiEventId === 'new') {
                return {
                    id: 'new',
                    name: '',
                    description: '',
                    visibility: 'public',
                    pageUrl: '',
                    eventTypes: [
                        {
                            id: 'new',
                            eventType: {
                                id: 'new',
                                name: '',
                                description: '',
                                visibility: 'public',
                                pageUrl: '',
                                durations: [],
                                locations: [],
                            },
                            position: 0,
                            bufferBefore: 0
                        }
                    ]
                };
            }

            try {
                return await getMultiEventType(multiEventId);
            } catch (error) {
                throw error;
            }
        }

        loadEventType()
            .then(data => {
                setMultiEventType(data);
            })
            .catch(data => {
                console.error('Error loading event type:', data);
                router.push('/multi-event-types');
            })
    }, [props.params, router]);

    const getData = useCallback((key: MultiEventTypeStringKeys): string => {
        if (updatedData[key] !== undefined) return updatedData[key] as string;
        return multiEventType?.[key] as string ?? '';
    }, [multiEventType, updatedData]);

    const setData = useCallback((key: MultiEventTypeStringKeys, value: string | MultiEventConnection[]) => {
        setUpdatedData(prevState => ({
            ...prevState,
            [key]: value,
        }));
    }, []);

    const isDataUpdated = useMemo(() => {
        if (!multiEventType) return false;

        return Object.keys(updatedData).some(key => {
            const typedKey = key as MultiEventTypeStringKeys;
            return (
                updatedData[typedKey] !== undefined &&
                updatedData[typedKey] !== multiEventType[typedKey]
            );
        });
    }, [multiEventType, updatedData]);

    const handleUndoChanges = useCallback(() => {
        setUpdatedData({});
    }, []);

    const eventTypeConnections = useMemo(() => {
        if (!multiEventType) return [];
        if (updatedData && updatedData.eventTypes) return updatedData.eventTypes as MultiEventConnection[];
        return multiEventType.eventTypes.sort((a, b) => a.position - b.position);
    }, [multiEventType, updatedData]);

    console.log(multiEventType, 'multiEventType');
    console.log(updatedData, 'updatedData');

    return (
        <Stack spacing={2} padding={2} sx={{width: '100%'}} paddingBottom={'5rem'} position={'relative'}>
            <Typography level={'h3'}>MULTI EVENT TYPE</Typography>
            <Stack direction={'column'}>
                <Input
                    placeholder={'name' in updatedData || multiEventType?.id === 'new' ? 'Event type title...' : ''}
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
                <Textarea
                    minRows={3}
                    placeholder="Multi event type description..."
                    variant="outlined"
                    size="md"
                    value={getData('description')}
                    onChange={(event) => setData('description', event.target.value)}
                    sx={{
                        marginBottom: '1rem',
                        padding: '0.5rem 0',
                        border: '0',
                        background: 'transparent',
                        color: 'white',
                        '&::before': {
                            display: 'none',
                        },
                        '&:focus-within': {
                            outline: 'none',
                            outlineOffset: '2px',
                        },
                    }}
                />
            </Stack>
            {eventTypeConnections ? (
                <EventsList eventConnections={eventTypeConnections} setEventConnections={(connections: MultiEventConnection[]) => {
                    setData(
                        'eventTypes',
                        connections
                    )
                }}/>
            ) : <></>}
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
                        <Button onClick={() => {
                        }}>
                            Save Changes
                        </Button>
                    </Stack>
                )
            }
        </Stack>
    );
};