import {EventTypeDuration} from "@/types/eventTypes/eventTypeDuration";
import {EventTypeLocation} from "@/types/eventTypes/eventTypeLocation";

export type EventType = {
    id: string;
    name: string;
    description: string;
    durations: EventTypeDuration[];
    locations: EventTypeLocation[];
    visibility: 'public' | 'private' | 'unlisted' | 'inherit';
    pageUrl: string;
}