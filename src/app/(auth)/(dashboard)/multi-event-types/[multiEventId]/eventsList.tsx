import {closestCenter, DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {horizontalListSortingStrategy, SortableContext, useSortable} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {MultiEventConnection} from "@/types/multiEventTypes/multiEventConnection";
import {useMemo} from "react";

type Props = {
    eventConnections: MultiEventConnection[];
}

const Card = ({ id }: { id: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: 150,
        height: 100,
        margin: "0 8px",
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ccc",
        borderRadius: 8,
        cursor: "grab",
        userSelect: "none",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            Card {id}
        </div>
    );
};

export default function EventsList(props: Props) {
    const { eventConnections } = props;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            // Reorder the items
        }
    };

    const sortedEvents = useMemo(() => {
        return eventConnections.sort((a, b) => a.position - b.position);
    }, [eventConnections]);

    return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={eventConnections} strategy={horizontalListSortingStrategy}>
            <div
                style={{
                    display: "flex",
                    overflowX: "auto",
                    padding: "16px",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                }}
            >
                {sortedEvents.map((eventConnection) => (
                    <Card key={eventConnection.id} id={eventConnection.id} />
                ))}
            </div>
        </SortableContext>
    </DndContext>
}