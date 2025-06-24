'use client';
import {Button, Divider, Input, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {useCallback, useEffect, useMemo, useState} from "react";
import {EventType} from "@/types";
import {getEventType} from "@/services/api";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {EventTypeDuration, EventTypeLocation} from "@/types/eventTypes";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

type Props = {
    params: Promise<{
        eventId: string
    }>
}

type EventTypeStringKeys = Exclude<{
    [K in keyof EventType]: EventType[K] extends string | undefined ? K : never
}[keyof EventType], 'durations'>;

type EventTypeDurationOptional = Omit<EventTypeDuration, 'id'> & { id?: string };
type EventTypeLocationOptional = Omit<EventTypeLocation, 'id'> & { id?: string };


export default function EventTypeIndividualPage(props: Props) {
    const [eventType, setEventType] = useState<EventType | null>(null);
    const [updatedData, setUpdatedData] = useState<Partial<EventType>>({});
    const [expandedDurations, setExpandedDurations] = useState<boolean>(false);
    const [expandedLocations, setExpandedLocations] = useState<boolean>(false);
    const [durations, setDurations] = useState<EventTypeDurationOptional[]>([]);
    const [locations, setLocations] = useState<EventTypeLocationOptional[]>()


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

    const convertMinutes = useCallback((minutes: number, short: boolean) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (short) {
            return `${hours <= 9 ? '0' : ''}${hours}:${mins}`;
        }
        let text = '';
        if (hours > 0) {
            text += `${hours} hour${hours > 1 ? 's' : ''} `;
        }
        if (mins > 0) {
            text += `${mins} minute${mins > 1 ? 's' : ''}`;
        }
        if (text === '') {
            return '0 minutes';
        }
        if (text.endsWith(' ')) {
            text = text.slice(0, -1); // Remove trailing space
        }
        return text;
    }, []);

    const updateDuration = useCallback((totalMinutes: number, index?: number) => {
        setDurations(prev => {
            if (index !== undefined && index >= 0 && index < prev.length) {
                return prev.map((duration, idx) => {
                    if (idx === index) {
                        return {
                            ...duration,
                            duration: totalMinutes,
                        };
                    }
                    return duration;
                });
            } else {
                console.log('Adding new duration:', totalMinutes);
                return [...prev, {
                    duration: totalMinutes,
                    isDefault: false,
                }];
            }
        });
    }, []);

    const defaultDurations = useMemo(() => {
        return [
            10,
            15,
            30,
            45,
            60,
            90,
            120,
            180
        ]
    }, []);

    const durationOptions = useCallback((selectedOption: number) => {
        return defaultDurations.filter(d => !durations.some(existing => {
            return existing.duration === d && (selectedOption === undefined || existing.duration !== selectedOption);
        }))
    }, [defaultDurations, durations]);

    const addNewOption = useCallback(() => {
        const duration = defaultDurations.find(d => !durations.some(existing => existing.duration === d));
        if (duration !== undefined) {
            setDurations(prev => [...prev, {duration, isDefault: false}]);
        }
    }, [defaultDurations, durations]);

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
                    <Stack direction={'column'} gap={1} width={'100%'}>
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
                        {
                            expandedDurations && (
                                <Stack
                                    component='li'
                                    direction='column'
                                    gap={1}
                                >
                                    {
                                        durations?.map((duration, index) => {
                                            return (
                                                <Stack
                                                    key={index}
                                                    direction={'row'}
                                                    alignItems="center"
                                                    justifyContent={'space-between'}
                                                    sx={{
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <Select
                                                        value={duration.duration}
                                                        onChange={(e, newValue) => {
                                                            if (newValue !== null) {
                                                                updateDuration(newValue, index);
                                                            }
                                                        }}
                                                        sx={{
                                                            fontSize: '1rem',
                                                            minWidth: '12rem',
                                                        }}
                                                        placeholder={'HH:MM'}

                                                    >
                                                        {durationOptions(duration.duration).map((option, idx) => (
                                                            <Option
                                                                key={idx}
                                                                value={option}
                                                                onClick={() => updateDuration(option, index)}
                                                            >
                                                                {convertMinutes(option, false)}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                    <Stack direction={'row'} gap={'.5rem'} alignItems={'center'}>
                                                        {
                                                            duration.isDefault ? (
                                                                <Typography level={'body-sm'} color={'success'}>
                                                                    Default
                                                                </Typography>
                                                            ) : (
                                                                <Button
                                                                    color={'neutral'}
                                                                    onClick={() => {
                                                                        setDurations(prev => prev.map((d, idx) => ({
                                                                            ...d,
                                                                            isDefault: idx === index,
                                                                        })));
                                                                    }}
                                                                >
                                                                    Set as default
                                                                </Button>
                                                            )
                                                        }
                                                        {
                                                            !duration.isDefault && (
                                                                <Button
                                                                    variant={'plain'}
                                                                    color={'danger'}
                                                                    onClick={() => {
                                                                        setDurations(prev => prev.filter((_, idx) => idx !== index));
                                                                    }}
                                                                >
                                                                    <RemoveCircleOutlineIcon/>
                                                                </Button>
                                                            )
                                                        }
                                                    </Stack>
                                                </Stack>
                                            );
                                        })
                                    }
                                    {durations.length < 5 && <Button
                                        variant={"soft"}
                                        color={"neutral"}
                                        onClick={addNewOption}
                                        sx={{
                                            marginTop: "0.5rem",
                                            width: "100%",
                                        }}
                                    >
                                        Add Duration
                                    </Button>}
                                </Stack>
                            )
                        }
                    </Stack>
                    <Stack direction={'column'} gap={1} width={'100%'}>
                        <Stack
                            component={'button'}
                            direction={'row'}
                            justifyContent={'space-between'}
                            onClick={() => setExpandedLocations(!expandedLocations)}
                            width={'100%'}
                            color={'white'}
                            padding={'0.5rem 0'}
                            sx={{
                                cursor: 'pointer',
                            }}
                        >
                            <Typography level={'h4'}>Locations</Typography>
                            <ArrowDropDownIcon
                                sx={{
                                    transform: expandedLocations ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease',
                                }}
                            />
                        </Stack>
                        {
                            expandedLocations && (
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
                                                    sx={{
                                                        cursor: 'pointer',
                                                    }}
                                                >

                                                    <Typography level={'body-sm'}>
                                                        {duration.isDefault ? 'Default' : 'Custom'}
                                                    </Typography>
                                                </Stack>

                                            );
                                        })
                                    }
                                </Stack>
                            )
                        }
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
};