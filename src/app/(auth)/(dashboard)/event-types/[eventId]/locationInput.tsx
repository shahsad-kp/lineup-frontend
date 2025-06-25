'use client'

import {Dispatch, SetStateAction, useMemo, useState} from "react";
import {Button, Stack, Typography} from "@mui/joy";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { EventTypeLocationOptional } from "@/types/eventTypes/eventTypeLocationOptional";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

type Props = {
    locations: EventTypeLocationOptional[];
    setLocations: Dispatch<SetStateAction<EventTypeLocationOptional[]>>
};

export const LocationInput = (props: Props) => {
    const {locations, setLocations} = props;
    const [expandedLocations, setExpandedLocations] = useState<boolean>(false);

    const locationTypeOptions = useMemo(() => {
        return [
            {
                value: 'in-person',
                label: 'In-Person',
            },
            {
                value: 'call',
                label: 'Call',
            }
        ]
    }, []);

    return (
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
                            locations?.map((eventLocation, index) => {
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
                                            sx={{
                                                fontSize: '1rem',
                                                minWidth: '12rem',
                                            }}
                                        >
                                            {locationTypeOptions.map((option, idx) => (
                                                <Option
                                                    key={idx}
                                                    value={option}
                                                >
                                                    {option.label}
                                                </Option>
                                            ))}
                                        </Select>
                                        <Stack direction={'row'} gap={'.5rem'} alignItems={'center'}>
                                            {
                                                eventLocation.isDefault ? (
                                                    <Typography level={'body-sm'} color={'success'}>
                                                        Default
                                                    </Typography>
                                                ) : (
                                                    <Button
                                                        color={'neutral'}
                                                    >
                                                        Set as default
                                                    </Button>
                                                )
                                            }
                                            {
                                                !eventLocation.isDefault && (
                                                    <Button
                                                        variant={'plain'}
                                                        color={'danger'}
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
                    </Stack>
                )
            }
        </Stack>
    );
};