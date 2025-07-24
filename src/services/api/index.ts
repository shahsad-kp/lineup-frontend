import {checkEmail, collectToken, registerUser, resendCode, verifyEmail} from "@/services/api/auth";
import {getAuthData} from "@/services/api/userData";
import {
    connectAccount as connectCalendarAccount,
    getCalendarSettings,
    getConnectedAccounts,
    getFullCalendars,
    updateCalendarSettings,
    updateConnectedAccount,
} from "@/services/api/calendar";

import {
    createConflictCalendar,
    setDefaultConflictCalendar,
    updateConflictCalendar,
    getConflictCalendar
} from "@/services/api/conflictCalendar";

import {
    createAvailabilityCalendar,
    getAvailabilityCalendar
} from "@/services/api/availabilityCalendar";

import {
    getSelfEventTypes,
    getEventType,
    updateEventType,
    createEventType
} from "@/services/api/eventTypes";

import {
    getSelfMultiEventTypes,
    getMultiEventType,
    updateMultiEventType
} from "@/services/api/multiEventTypes";

export {
    checkEmail,
    collectToken,
    registerUser,
    getAuthData,
    verifyEmail,
    resendCode,
    connectCalendarAccount,
    getConnectedAccounts,
    updateConnectedAccount,
    getFullCalendars,
    getCalendarSettings,
    updateCalendarSettings,
    createConflictCalendar,
    setDefaultConflictCalendar,
    updateConflictCalendar,
    getConflictCalendar,
    createAvailabilityCalendar,
    getAvailabilityCalendar,
    getSelfEventTypes,
    getEventType,
    updateEventType,
    createEventType,
    getSelfMultiEventTypes,
    getMultiEventType,
    updateMultiEventType,
}