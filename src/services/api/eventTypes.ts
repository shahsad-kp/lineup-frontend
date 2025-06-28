import {privateInstance} from "@/services/api/instance";
import {EventType, EventTypeCreateData, EventTypeUpdateData} from "@/types";

const getSelfEventTypes = async () => {
    const result = await privateInstance.get<EventType[]>('/event-type/');
    return result.data
}

const getEventType = async (eventId: string) => {
    const result = await privateInstance.get<EventType>(`/event-type/${eventId}/`);
    return result.data
}

const updateEventType = async (eventId: string, data: EventTypeUpdateData) => {
    const result = await privateInstance.patch<EventType>(`/event-type/${eventId}/`, data);
    return result.data
}

const createEventType = async (data: EventTypeCreateData) => {
    const result = await privateInstance.post<EventType>(`/event-type/`, data);
    return result.data
}

export {
    getSelfEventTypes,
    getEventType,
    updateEventType,
    createEventType
}