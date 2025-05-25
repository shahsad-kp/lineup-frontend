import {ConflictCalendar} from "@/types";
import {privateInstance} from "@/services/api/instance";
import {Settings} from "node:http2";


const createConflictCalendar = async (calendarIds: string[]) => {
    const result = await privateInstance.post<ConflictCalendar>(`/conflict-calendar/`, {calendarIds});
    return result.data
}

const setDefaultConflictCalendar = async (conflictCalendarId: string) => {
    const result = await privateInstance.patch<Settings>(`/calendar-settings/`, {defaultConflictGroup: conflictCalendarId});
    return result.data
}

const updateConflictCalendar = async (conflictCalendarId: string, calendarIds: string[]) => {
    const result = await privateInstance.patch<ConflictCalendar>(`/conflict-calendar/${conflictCalendarId}/`, {calendarIds});
    return result.data
}

const getConflictCalendar = async (conflictCalendarId: string) => {
    const result = await privateInstance.get<ConflictCalendar>(`/conflict-calendar/${conflictCalendarId}/`);
    return result.data
}

export {
    createConflictCalendar,
    setDefaultConflictCalendar,
    updateConflictCalendar,
    getConflictCalendar
}