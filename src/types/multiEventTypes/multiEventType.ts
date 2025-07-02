import {AuthData} from "@/types";
import {MultiEventConnection} from "@/types/multiEventTypes/multiEventConnection";

export type MultiEventType = {
    id: string;
    name: string;
    owner: AuthData;
    visibility: 'public' | 'private' | 'unlisted';
    pageSlug: string;
    eventTypes: MultiEventConnection[];
}