import {EventTypeDuration} from "@/types/eventTypes/eventTypeDuration";

export type EventTypeDurationOptional = Omit<EventTypeDuration, 'id'> & { id?: string };
