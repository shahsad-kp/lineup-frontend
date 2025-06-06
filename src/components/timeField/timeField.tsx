import * as React from 'react';
import { Autocomplete } from '@mui/joy';
import {TimeString} from "@/types/times";

type Props = {
    placeholder: string,
    timeOptions: string[],
    value: TimeString,
    onChange: (value: TimeString) => void,
};

export function TimeField(props: Props) {
    return (
        <Autocomplete
            placeholder={props.placeholder}
            autoSelect
            autoHighlight
            slotProps={{
                input: { sx: { width: '70px' } },
                listbox: {
                    sx: {
                        maxHeight: '200px',
                        overflowY: 'scroll',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                    },
                },
                popupIndicator: { sx: { display: 'none' } },
            }}
            size="sm"
            disableClearable
            onChange={(_, value) => props.onChange(value as TimeString)}
            noOptionsText="Select a time"
            options={props.timeOptions}
            value={props.value}
        />
    );
}
