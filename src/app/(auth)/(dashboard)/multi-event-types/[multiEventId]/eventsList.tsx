'use client';

import {Stack} from "@mui/joy";
import {closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors,} from "@dnd-kit/core";
import {restrictToHorizontalAxis} from '@dnd-kit/modifiers';

import {arrayMove, horizontalListSortingStrategy, SortableContext,} from "@dnd-kit/sortable";

import {MultiEventConnection} from "@/types/multiEventTypes/multiEventConnection";
import EventCard from "@/app/(auth)/(dashboard)/multi-event-types/[multiEventId]/eventCard";

type Props = {
    eventConnections: MultiEventConnection[];
    setEventConnections: (connections: MultiEventConnection[]) => void;
};

export default function EventsList(props: Props) {
    const {eventConnections, setEventConnections} = props;
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {distance: 5},
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!over || active.id === over.id) return;

        const oldIndex = eventConnections.findIndex(item => item.id === active.id);
        const newIndex = eventConnections.findIndex(item => item.id === over.id);

        const reordered = arrayMove(eventConnections, oldIndex, newIndex).map(
            (item, index) => ({
                ...item,
                position: index, // update position field
            })
        );

        setEventConnections(reordered);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToHorizontalAxis]}
        >
            <SortableContext
                items={eventConnections.map(item => item.id)}
                strategy={horizontalListSortingStrategy}
            >

                <Stack
                    direction="row"
                    gap={3}
                    sx={{
                        overflowX: "auto",
                        py: 2,
                    }}
                >
                    {eventConnections.map(eventConnection => (
                        <EventCard
                            key={eventConnection.id}
                            eventTypeConnection={eventConnection}
                        />
                    ))}
                </Stack>
            </SortableContext>
        </DndContext>
    );
}
