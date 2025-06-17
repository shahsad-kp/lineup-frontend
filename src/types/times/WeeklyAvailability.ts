import {WeekDay} from "@/types/times/WeekDay";
import {DayTimeSlot} from "@/types/times/DayTimeSlot";

export type WeeklyAvailability = {
    [day in WeekDay]: DayTimeSlot[];
}