const areObjectsDifferent = (a: Record<string, any>, b: Record<string, any>): boolean => {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
        if (a[key] !== b[key]) return true;
    }
    return false;
};

const convertMinutes = (minutes: number, short: boolean): string => {
    const MINUTES_IN_MONTH = 43200;
    const MINUTES_IN_DAY = 1440;
    const MINUTES_IN_HOUR = 60;

    const months = Math.floor(minutes / MINUTES_IN_MONTH);
    minutes %= MINUTES_IN_MONTH;

    const days = Math.floor(minutes / MINUTES_IN_DAY);
    minutes %= MINUTES_IN_DAY;

    const hours = Math.floor(minutes / MINUTES_IN_HOUR);
    const mins = minutes % MINUTES_IN_HOUR;

    if (short) {
        const pad = (n: number) => `${n < 10 ? '0' : ''}${n}`;
        // Format: MM-DD HH:MM or DD HH:MM if no months
        const parts = [];
        if (months > 0) parts.push(pad(months) + 'M');
        if (months > 0 || days > 0) parts.push(pad(days) + 'D');
        parts.push(`${pad(hours)}:${pad(mins)}`);
        return parts.join(' ');
    }

    const segments = [];
    if (months > 0) segments.push(`${months} month${months > 1 ? 's' : ''}`);
    if (days > 0) segments.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) segments.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (mins > 0) segments.push(`${mins} minute${mins > 1 ? 's' : ''}`);

    return segments.length ? segments.join(' ') : '0 minutes';
};


export {
    areObjectsDifferent,
    convertMinutes
}