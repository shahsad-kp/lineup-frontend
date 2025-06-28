'use client'

import {Dispatch, SetStateAction, useCallback, useMemo, useState} from "react";
import {Box, Button, Input, Radio, RadioGroup, Stack, Textarea, Typography} from "@mui/joy";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {EventTypeLocationOptional} from "@/types/eventTypes/eventTypeLocationOptional";
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

    const setLocationType = useCallback((locationType: string, index: number) => {
        setLocations((prevLocations) => {
            const updatedLocations = [...prevLocations];
            updatedLocations[index] = {
                ...updatedLocations[index],
                locationType: locationType as 'in-person' | 'call',
            };
            return updatedLocations;
        });
    }, [setLocations]);

    const updateRequireInviteeNumber = useCallback((requireInviteeNumber: boolean, index: number) => {
        setLocations((prevLocations) => {
            const updatedLocations = [...prevLocations];
            updatedLocations[index] = {
                ...updatedLocations[index],
                requireInviteeNumber: requireInviteeNumber,
            };
            return updatedLocations;
        });
    }, [setLocations]);

    const updatePhoneNumber = useCallback((phoneNumber: string, index: number) => {
        setLocations((prevLocations) => {
            const updatedLocations = [...prevLocations];
            updatedLocations[index] = {
                ...updatedLocations[index],
                phoneNumber
            };
            return updatedLocations;
        });
    }, [setLocations]);

    const addNewOption = useCallback(() => {
        setLocations((prevLocations) => {
            if (prevLocations.length >= 5) return prevLocations; // Limit to 5 locations
            return [...prevLocations, {
                id: crypto.randomUUID(),
                locationType: 'in-person',
                isDefault: false,
                address: '',
                requireInviteeNumber: true,
                phoneNumber: '',
            }];
        });
    }, [setLocations]);

    const setDefault = useCallback((index: number) => {
        setLocations((prevLocations) => {
            return prevLocations.map((location, idx) => ({
                ...location,
                isDefault: idx === index,
            }));
        });
    }, [setLocations]);

    const removeLocation = useCallback((index: number) => {
        setLocations((prevLocations) => {
            return prevLocations.filter((_, idx) => idx !== index);
        });
    }, [setLocations]);

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
                        component={'ul'}
                        direction={'column'}
                        gap={3}
                    >
                        {
                            locations?.map((eventLocation, index) => {
                                return (
                                    <Stack
                                        component={'li'}
                                        key={index}
                                        direction={'column'}
                                        gap={2}
                                    >
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
                                                placeholder={'Select location type...'}
                                                value={eventLocation.locationType}
                                                onChange={(e, value) => setLocationType(value as string, index)}
                                            >
                                                {locationTypeOptions.map((option, idx) => (
                                                    <Option
                                                        key={idx}
                                                        value={option.value}
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
                                                            onClick={() => setDefault(index)}
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
                                                            onClick={() => removeLocation(index)}
                                                        >
                                                            <RemoveCircleOutlineIcon/>
                                                        </Button>
                                                    )
                                                }
                                            </Stack>
                                        </Stack>
                                        <Box>
                                            {
                                                eventLocation.locationType === 'in-person' ? (
                                                    <Stack direction={'column'} gap={'.5rem'}>
                                                        <Textarea
                                                            minRows={2}
                                                            placeholder={'Address...'}
                                                            value={eventLocation.address || ''}
                                                            onChange={(e) => {
                                                                setLocations((prevLocations) => {
                                                                    const updatedLocations = [...prevLocations];
                                                                    updatedLocations[index] = {
                                                                        ...updatedLocations[index],
                                                                        address: e.target.value,
                                                                    };
                                                                    return updatedLocations;
                                                                });
                                                            }}
                                                        />
                                                    </Stack>
                                                ) : (
                                                    <Stack direction={'column'} gap={'.5rem'}>
                                                        <RadioGroup
                                                            defaultValue={true}
                                                            name="radio-buttons-group"
                                                            onChange={(event) => {
                                                                updateRequireInviteeNumber(event.target.value === 'true', index);
                                                            }}
                                                            value={eventLocation.requireInviteeNumber}
                                                        >
                                                            <Radio value={'true'} label="Require Invitee Number"
                                                                   variant="outlined"/>
                                                            <Radio value={'false'}
                                                                   label="Provide a phone number to invitees after they book."
                                                                   variant="soft"/>
                                                        </RadioGroup>
                                                        {
                                                            !eventLocation.requireInviteeNumber && (
                                                                <Input
                                                                    size="md"
                                                                    placeholder="Phone Number"
                                                                    value={eventLocation.phoneNumber || ''}
                                                                    onChange={(e) => updatePhoneNumber(e.target.value, index)}
                                                                    type="tel"
                                                                    sx={{width: '100%', marginTop: '0.5rem'}}
                                                                />
                                                            )
                                                        }
                                                    </Stack>
                                                )
                                            }
                                        </Box>
                                    </Stack>
                                );
                            })
                        }
                        {
                            locations.length < 5 && <Button
                                variant={"soft"}
                                color={"neutral"}
                                onClick={addNewOption}
                                sx={{
                                    marginTop: "0.5rem",
                                    width: "100%",
                                }}
                            >
                                Add Location
                            </Button>
                        }
                    </Stack>
                )
            }
        </Stack>
    );
};