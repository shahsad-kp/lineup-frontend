import {AvailabilityCalendar} from "@/types";
import {privateInstance} from "@/services/api/instance";

const createAvailabilityCalendar = async (calendar: AvailabilityCalendar) => {
    const result = await privateInstance.post<AvailabilityCalendar>(`/availability/`, calendar);
    return result.data
}

const getAvailabilityCalendar = async (calendarId: string) => {
    const result = await privateInstance.post<AvailabilityCalendar>(`/availability/${calendarId}/`);
    return result.data
}

export {
    createAvailabilityCalendar,
    getAvailabilityCalendar
}