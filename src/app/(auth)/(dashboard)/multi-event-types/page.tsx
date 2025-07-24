'use client';
import {Button, Grid, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {useEffect, useState} from "react";
import {getSelfMultiEventTypes} from "@/services/api";
import {MultiEventType} from "@/types";
import {useRouter} from "next/navigation";
import AddIcon from '@mui/icons-material/Add';

export default function MultiEventTypeListPage() {
    const [eventTypes, setEventTypes] = useState<MultiEventType[]>([]);
    const router = useRouter();

    useEffect(() => {
        getSelfMultiEventTypes().then(res => setEventTypes(res));
    }, []);

    return (
        <Stack spacing={2} padding={2} sx={{width: '100%'}} position={'relative'} height={'100%'}>
            <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography level={'h3'}>Multi Event Types</Typography>
                <Button variant={'solid'} onClick={() => {
                    router.push('/multi-event-types/new')
                }}>
                    <AddIcon/>
                </Button>
            </Stack>
            <Grid container gap={2}>
                <Stack
                    width={'15rem'}
                    height={'15rem'}
                    direction={'column'}
                    bgcolor={'grey'}
                    component={'div'}
                    borderRadius={'8px'}
                    borderColor={'black'}
                    padding={2}
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        },
                    }}
                    onClick={
                        () => {
                            router.push('/multi-event-types/new/');
                        }
                    }
                >
                    <AddIcon/>
                </Stack>
                {eventTypes.map((eventType, index) => (
                    <Stack
                        width={'15rem'}
                        height={'15rem'}
                        direction={'column'}
                        bgcolor={'grey'}
                        key={index}
                        component={'div'}
                        borderRadius={'8px'}
                        padding={2}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            },
                        }}
                        onClick={
                            () => {
                                router.push('/multi-event-types/' + eventType.id);
                            }
                        }
                    >
                        <Typography level={'h4'}>{eventType.name}</Typography>
                        <Typography>{eventType.eventTypeConnections.length} event{eventType.eventTypeConnections.length <= 1 ? '' : 's'}</Typography>
                        <Typography
                            sx={{
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 3,
                            }}
                            level={'body-md'}
                        >
                            {eventType.description}
                        </Typography>
                        <Typography level={'body-sm'} marginTop={2}>
                            {eventType.visibility}
                        </Typography>
                        <Typography level={'body-sm'} color={'warning'} marginTop={1}>
                            {eventType.pageUrl}
                        </Typography>
                    </Stack>
                ))}
            </Grid>
        </Stack>
    );
};