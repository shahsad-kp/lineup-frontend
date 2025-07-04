import {AuthData} from "@/types";
import {MultiEventConnection} from "@/types/multiEventTypes/multiEventConnection";

export type MultiEventType = {
    id: string;
    name: string;
    description: string;
    owner: AuthData;
    visibility: 'public' | 'private' | 'unlisted';
    pageUrl: string;
    eventTypes: MultiEventConnection[];
}