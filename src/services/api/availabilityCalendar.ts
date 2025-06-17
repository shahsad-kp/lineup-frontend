import {AvailabilityCalendar} from "@/types";
import {privateInstance} from "@/services/api/instance";

const createAvailabilityCalendar = async (calendar: Partial<AvailabilityCalendar>) => {
    const result = await privateInstance.post<AvailabilityCalendar>(`/availability/`, calendar);
    return result.data
}

const updateAvailabilityCalendar = async (availabilityCalendarId: string, calendar: Partial<AvailabilityCalendar>) => {
    const result = await privateInstance.patch<AvailabilityCalendar>(`/availability/${availabilityCalendarId}/`, calendar);
    return result.data
}

const getAvailabilityCalendar = async (calendarId: string) => {
    const result = await privateInstance.get<AvailabilityCalendar>(`/availability/${calendarId}/`);
    return result.data
}

export {
    createAvailabilityCalendar,
    updateAvailabilityCalendar,
    getAvailabilityCalendar
}