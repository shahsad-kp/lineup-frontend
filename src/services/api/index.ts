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
    getSelfEventTypes
} from "@/services/api/eventTypes";

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
    getSelfEventTypes
}