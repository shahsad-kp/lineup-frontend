import {useSortable} from "@dnd-kit/sortable";
import {useRouter} from "next/navigation";
import {Stack, Typography} from "@mui/joy";
import {CSS} from "@dnd-kit/utilities";
import {convertMinutes} from "@/services/utils/utilFunctions";
import {MultiEventConnection} from "@/types/multiEventTypes/multiEventConnection";


type CardProps = {
    eventTypeConnection: MultiEventConnection;
};

export default function EventCard ({eventTypeConnection}: CardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: eventTypeConnection.id});

    const router = useRouter();

    return (
        <Stack
            direction="row"
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            gap={2}
            alignItems="center"
            bgcolor="rgba(64,64,64,0.1)"
            borderRadius={4}
            justifyContent="space-evenly"
        >
            {eventTypeConnection.bufferBefore >= 1 && (
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    onClick={() =>
                        router.push(`/multi-event-types/${eventTypeConnection.id}`)
                    }
                    width="fit-content"
                    ml={3}
                    sx={{cursor: "pointer"}}
                >
                    <Typography textColor="white">
                        {convertMinutes(eventTypeConnection.bufferBefore, false)}
                    </Typography>
                </Stack>
            )}

            <Stack
                width="15rem"
                height="15rem"
                direction="column"
                bgcolor="grey"
                borderRadius={4}
                padding={2}
                sx={{
                    cursor: "pointer",
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                    },
                }}
            >
                <Typography level="h4">{eventTypeConnection.eventType.name}</Typography>
                <Typography
                    sx={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                    }}
                    level="body-md"
                >
                    {eventTypeConnection.eventType.description}
                </Typography>
                <Typography level="body-sm" mt={2}>
                    {eventTypeConnection.eventType.visibility}
                </Typography>
                <Typography level="body-sm" color="warning" mt={1}>
                    {eventTypeConnection.eventType.pageUrl}
                </Typography>
            </Stack>
        </Stack>
    );
};
