'use client';
import {Button, Grid, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {useEffect, useState} from "react";
import {getSelfEventTypes} from "@/services/api";
import {EventType} from "@/types";
import {useRouter} from "next/navigation";
import AddIcon from '@mui/icons-material/Add';

export default function EventTypeListPage() {
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const router = useRouter();

    useEffect(() => {
        getSelfEventTypes().then(res => setEventTypes(res));
    }, []);

    return (
        <Stack spacing={2} padding={2} sx={{width: '100%'}} position={'relative'} height={'100%'}>
            <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography level={'h3'}>Event Types</Typography>
                <Button variant={'solid'} onClick={() => {
                    router.push('/event-types/new')
                }}>
                    <AddIcon/>
                </Button>
            </Stack>
            <Grid container gap={2}>
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
                                router.push('/event-types/' + eventType.id);
                            }
                        }
                    >
                        <Typography level={'h4'}>{eventType.name}</Typography>
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