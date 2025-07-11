import {closestCenter, DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {horizontalListSortingStrategy, SortableContext, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {MultiEventConnection} from "@/types/multiEventTypes/multiEventConnection";
import {useMemo} from "react";
import {Stack, Typography} from "@mui/joy";
import {useRouter} from "next/navigation";

type Props = {
    eventConnections: MultiEventConnection[];
}

type CardProps = {
    eventTypeConnection: MultiEventConnection;
}

const Card = (props: CardProps) => {
    const {eventTypeConnection} = props;
    const {attributes, listeners, setNodeRef, transform, transition} =
        useSortable(eventTypeConnection);
    const router = useRouter();

    return (
        <Stack
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            width={'15rem'}
            height={'15rem'}
            direction={'column'}
            bgcolor={'grey'}
            // key={eventType.id}
            component={'div'}
            borderRadius={'8px'}
            padding={2}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
            }}
            onClick={
                () => {
                    router.push('/multi-event-types/');
                }
            }
            style={{
                transform: CSS.Transform.toString(transform),
                transition
            }}
        >
            <Typography level={'h4'}>{eventTypeConnection.eventType.name}</Typography>
            <Typography
                sx={{
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                }}
                level={'body-md'}
            >
                {eventTypeConnection.eventType.description}
            </Typography>
            <Typography level={'body-sm'} marginTop={2}>
                {eventTypeConnection.eventType.visibility}
            </Typography>
            <Typography level={'body-sm'} color={'warning'} marginTop={1}>
                {eventTypeConnection.eventType.pageUrl}
            </Typography>
        </Stack>
    );
};

export default function EventsList(props: Props) {
    const {eventConnections} = props;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = (event: any) => {
        const {active, over} = event;
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
                    <Card key={eventConnection.id} eventTypeConnection={eventConnection}/>
                ))}
            </div>
        </SortableContext>
    </DndContext>
}