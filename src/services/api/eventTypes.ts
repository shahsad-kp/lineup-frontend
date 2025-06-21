import {privateInstance} from "@/services/api/instance";
import {EventType} from "@/types";

const getSelfEventTypes = async () => {
    const result = await privateInstance.get<EventType[]>(`/event-type/`);
    return result.data
}

export {
    getSelfEventTypes
}