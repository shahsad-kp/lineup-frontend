import {privateInstance} from "@/services/api/instance";
import {MultiEventType} from "@/types";

const getSelfMultiEventTypes = async () => {
    const result = await privateInstance.get<MultiEventType[]>('/multi-event-types/');
    return result.data
}

const getMultiEventType = (multiEventTypeId: string) => {
    return privateInstance.get<MultiEventType>(`/multi-event-types/${multiEventTypeId}/`)
        .then(result => result.data);
}

export {
    getSelfMultiEventTypes,
    getMultiEventType
}