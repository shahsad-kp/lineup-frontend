import {EventType} from "@/types";

export type MultiEventConnection = {
    id: string;
    eventType: EventType;
    position: number;
    bufferBefore: number;
}