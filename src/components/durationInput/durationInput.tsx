'use client'

import {Button, Stack, Typography} from "@mui/joy";
import {Dispatch, SetStateAction, useCallback, useMemo, useState} from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {EventTypeDurationOptional} from "@/types/eventTypes/eventTypeDurationOptional";
import {convertMinutes} from "@/services/utils/utilFunctions";

type Props = {
    durations: EventTypeDurationOptional[];
    setDurations: Dispatch<SetStateAction<EventTypeDurationOptional[]>>
};

export const DurationInput = (props: Props) => {
    const {durations, setDurations} = props;
    const [expandedDurations, setExpandedDurations] = useState<boolean>(false);

    const defaultDurations = useMemo(() => {
        return [
            10,
            15,
            30,
            45,
            60,
            90,
            120,
            180,
        ]
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
    }, [setDurations]);

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
    }, [defaultDurations, durations, setDurations]);


    return (
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
    );
};