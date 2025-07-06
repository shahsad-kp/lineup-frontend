'use client';
import {Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {useEffect, useState} from "react";
import {MultiEventType} from "@/types";
import {getMultiEventType} from "@/services/api";
import {useRouter} from "next/navigation";

type Props = {
    params: Promise<{
        multiEventId: string
    }>
}


export default function MultiEventTypeIndividualPage(props: Props) {
    const [multiEventType, setMultiEventType] = useState<MultiEventType | null>(null);
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
                router.push('/event-types');
            })
    }, [props.params, router]);

    return (
        <Stack spacing={2} padding={2} sx={{width: '100%'}} paddingBottom={'5rem'} position={'relative'}>
            <Typography level={'h3'}>MULTI EVENT TYPE</Typography>
        </Stack>
    );
};