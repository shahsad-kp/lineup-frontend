import {MultiEventConnection} from "@/types/multiEventTypes/multiEventConnection";

export type MultiEventType = {
    id: string;
    name: string;
    description: string;
    visibility: 'public' | 'private' | 'unlisted';
    pageUrl: string;
    eventTypeConnections: MultiEventConnection[];
}