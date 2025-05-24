import {Calendar} from "@/types/Calendar";

export type CalendarAccount = {
    id: string,
    name: string,
    provider: string,
    connectedOn: Date,
    calendars?: Calendar[]
}