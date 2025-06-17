import {privateInstance} from "@/services/api/instance";
import {Calendar, CalendarAccount, ConnectCalendarData} from "@/types";
import {CalendarSettings} from "@/types/settings";

const connectAccount = async (data: ConnectCalendarData) => {
    const result = await privateInstance.post<CalendarAccount>('/accounts/', data);
    return result.data
}

const getConnectedAccounts = async () => {
    const result = await privateInstance.get<CalendarAccount[]>('/accounts/');
    return result.data
}

const updateConnectedAccount = async (calendarId: string, name: string) => {
    const result = await privateInstance.put<CalendarAccount>(`/accounts/${calendarId}/`, {name});
    return result.data
}


const getCalendars = async () => {
    const result = await privateInstance.get<Calendar[]>(`/calendar/`);
    return result.data
}

const getFullCalendars = async () => {
    const result = await privateInstance.get<CalendarAccount[]>(`/accounts/full_data/`);
    return result.data
}

const getCalendarSettings = async () => {
    const result = await privateInstance.get<CalendarSettings>(`/calendar-settings/`);
    return result.data
}

const updateCalendarSettings = async (settings: Partial<CalendarSettings>) => {
    const result = await privateInstance.patch<CalendarSettings>(`/calendar-settings/`, settings);
    return result.data
}

export {
    connectAccount,
    getConnectedAccounts,
    updateConnectedAccount,
    getCalendars,
    getFullCalendars,
    getCalendarSettings,
    updateCalendarSettings
}