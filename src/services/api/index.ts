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
    updateCalendarSettings
}