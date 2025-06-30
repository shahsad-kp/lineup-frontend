import {privateInstance} from "@/services/api/instance";
import {EventType} from "@/types";

const getSelfMultiEventTypes = async () => {
    const result = await privateInstance.get<EventType[]>('/multi-event-types/');
    return result.data
}

export {
    getSelfMultiEventTypes
}