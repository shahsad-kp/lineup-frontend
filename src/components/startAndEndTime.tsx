import React, {useMemo} from 'react';
import {Stack} from '@mui/joy';
import {TimeField} from "@/components/timeField/timeField";
import {TimeString} from "@/types/times";

type Props = {
    startTime: TimeString;
    endTime: TimeString;
    setStartTime: (value: TimeString) => void;
    setEndTime: (value: TimeString) => void;
};

export const StartAndEndTime = (props: Props) => {
    const timeOptions: string[] = useMemo(() => {
        return Array.from({length: 24}, (_, hour) => {
            let hourString = hour.toString();
            if (hour < 10) {
                hourString = `0${hour}`;
            }
            return [
                `${hourString}:00`,
                `${hourString}:30`,
            ];
        }).flat();
    }, []);

    const filteredStartOptions = timeOptions.filter(
        (option) => {
            return option < props.endTime;
        }
    );

    const filteredEndOptions = timeOptions.filter(
        (option) => {
            return option > props.startTime;
        }
    );

    return (
        <Stack direction={'row'} gap={2} sx={{alignItems: 'center'}}>
            <TimeField
                placeholder="Start time"
                timeOptions={filteredStartOptions}
                value={props.startTime}
                onChange={value => {props.setStartTime(value)}}
            />
            -
            <TimeField
                placeholder="End time"
                timeOptions={filteredEndOptions}
                value={props.endTime}
                onChange={value => {props.setEndTime(value)}}
            />

        </Stack>
    );
};
