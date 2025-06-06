export type DateAvailability = {
    [date: DateString]: {
        start: string,
        end: string,
        available: boolean
    }
}[];