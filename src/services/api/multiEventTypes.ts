import {privateInstance} from "@/services/api/instance";
import {CreateMultiEventTypeData, MultiEventType, UpdateMultiEventTypeData} from "@/types";

const getSelfMultiEventTypes = async () => {
    const result = await privateInstance.get<MultiEventType[]>('/multi-event-types/');
    return result.data
}

const getMultiEventType = async (multiEventTypeId: string) => {
    const result = await privateInstance.get<MultiEventType>(`/multi-event-types/${multiEventTypeId}/`);
    return result.data;
}

const updateMultiEventType = async (multiEventTypeId: string, updateMultiEventTypeData: UpdateMultiEventTypeData) => {
    const result = await privateInstance.patch<MultiEventType>(`/multi-event-types/${multiEventTypeId}/`, updateMultiEventTypeData);
    return result.data;
}

const createMultiEventType = async (data: CreateMultiEventTypeData) => {
    const result = await privateInstance.post<MultiEventType>(`/multi-event-types/`, data);
    return result.data;
}

export {
    getSelfMultiEventTypes,
    getMultiEventType,
    updateMultiEventType,
    createMultiEventType
}