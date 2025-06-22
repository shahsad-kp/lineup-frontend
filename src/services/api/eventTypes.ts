import {privateInstance} from "@/services/api/instance";
import {EventType} from "@/types";

const getSelfEventTypes = async () => {
    const result = await privateInstance.get<EventType[]>('/event-type/');
    return result.data
}

const getEventType = async (eventId: string) => {
    const result = await privateInstance.get<EventType>(`/event-type/${eventId}`);
    return result.data
}

export {
    getSelfEventTypes,
    getEventType
}