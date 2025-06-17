'use client';
import { useEffect } from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { getTimeZones } from "@vvo/tzdb";

type Props = {
    includeUtc?: boolean;
    value: string | null;
    setValue: (value: string | null) => void;
    autoSelectUserTimeZone?: boolean;
}

export const TimeZoneField = (props: Props) => {
    const timeZonesWithUtc = getTimeZones({ includeUtc: props.includeUtc });
    const {value, setValue, autoSelectUserTimeZone} = props;

    useEffect(() => {
        if (autoSelectUserTimeZone && !value) {
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const now = new Date();
            const userOffsetMinutes = -now.getTimezoneOffset();

            const matchedTz = timeZonesWithUtc.find(tz => {
                const offset = tz.currentTimeOffsetInMinutes ?? tz.rawOffsetInMinutes;
                return offset === userOffsetMinutes;
            });

            if (matchedTz) {
                setValue(matchedTz.name);
            } else {
                setValue(userTimeZone);
            }
        }
    }, [autoSelectUserTimeZone, setValue, timeZonesWithUtc, value]);

    return (
        <Select
            placeholder="Select Timezone"
            sx={{ width: '100%' }}
            value={value}
            onChange={(e, newValue) => setValue(newValue || null)}
        >
            {timeZonesWithUtc.map((tz) => {
                const offset = tz.currentTimeOffsetInMinutes ?? tz.rawOffsetInMinutes;
                const hours = Math.floor(Math.abs(offset) / 60);
                const minutes = Math.abs(offset) % 60;
                const sign = offset >= 0 ? "+" : "-";
                const formattedOffset = `${sign}${hours}:${minutes.toString().padStart(2, "0")}`;
                const label = `${formattedOffset} ${tz.name} `;
                return (
                    <Option key={tz.name} value={tz.name}>
                        {label}
                    </Option>
                );
            })}
        </Select>
    );
};
