'use client';
import {Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {useEffect, useState} from "react";
import {EventType} from "@/types";
import {getEventType} from "@/services/api";
import {useRouter} from "next/navigation";
import {EventComponent} from "@/components/eventComponent/eventComponent";

type Props = {
    params: Promise<{
        eventId: string
    }>
}


export default function EventTypeIndividualPage(props: Props) {
    const [eventType, setEventType] = useState<EventType | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function loadEventType(): Promise<EventType> {
            const {eventId} = await props.params;
            if (eventId === 'new') {
                return {
                    id: 'new',
                    name: '',
                    description: '',
                    visibility: 'public',
                    pageUrl: '',
                    durations: [],
                    locations: [],
                };
            }

            try {
                return await getEventType(eventId);
            } catch (error) {
                throw error;
            }
        }

        loadEventType()
            .then(data => {
                setEventType(data);
            })
            .catch(data => {
                console.error('Error loading event type:', data);
                router.push('/event-types');
            })
    }, [props.params, router]);

    return (
        <Stack spacing={2} padding={2} sx={{width: '100%'}} paddingBottom={'5rem'} position={'relative'}>
            <Typography level={'h3'}>EVENT TYPE</Typography>
            {eventType ? (
                <EventComponent
                    eventType={eventType}
                    setEventType={setEventType}
                />
            ) : (
                <Typography level={'body-md'}>Loading...</Typography>
            )}
        </Stack>
    );
};