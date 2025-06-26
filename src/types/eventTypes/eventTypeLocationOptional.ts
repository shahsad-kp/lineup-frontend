import {EventTypeLocation} from "@/types/eventTypes/eventTypeLocation";

export type EventTypeLocationOptional = Omit<EventTypeLocation, 'id'> & { id?: string };
