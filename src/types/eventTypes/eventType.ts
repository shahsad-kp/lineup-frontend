import {EventTypeDuration} from "@/types/eventTypes/eventTypeDuration";

export type EventType = {
    id: string;
    name: string;
    description: string;
    durations: EventTypeDuration[];
    visibility: 'public' | 'private' | 'unlisted' | 'inherit';
    pageUrl: string;
}