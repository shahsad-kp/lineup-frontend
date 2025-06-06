import {WeeklyAvailability} from "@/types/times/WeeklyAvailability";
import {DateAvailability} from "@/types/times/DateAvailability";

export type AvailabilityCalendar = {
    id?: string,
    createdAt: Date,
    updatedAt: Date,
    timezone: string,
    weeklyAvailability: WeeklyAvailability,
    individualDaysAvailability: DateAvailability,
}