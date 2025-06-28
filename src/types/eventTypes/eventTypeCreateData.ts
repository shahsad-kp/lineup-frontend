import {EventType} from "@/types";
import {EventTypeDurationOptional} from "@/types/eventTypes/eventTypeDurationOptional";
import {EventTypeLocationOptional} from "@/types/eventTypes/eventTypeLocationOptional";

export type EventTypeCreateData = Omit<EventType, 'id' | 'durations' | 'locations'> & {
    durations: EventTypeDurationOptional[];
    locations: EventTypeLocationOptional[];
}