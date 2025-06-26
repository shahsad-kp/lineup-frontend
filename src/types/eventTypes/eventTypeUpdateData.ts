import {EventType} from "@/types";
import {EventTypeDurationOptional} from "@/types/eventTypes/eventTypeDurationOptional";
import {EventTypeLocationOptional} from "@/types/eventTypes/eventTypeLocationOptional";

export type EventTypeUpdateData = Omit<EventType, 'id' | 'durations' | 'locations'> & {
    durations: EventTypeDurationOptional[];
    locations: EventTypeLocationOptional[];
};