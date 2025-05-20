import {checkEmail, collectToken, registerUser, verifyEmail, resendCode} from "@/services/api/auth";
import {getAuthData} from "@/services/api/userData";
import {connectAccount as connectCalendarAccount} from "@/services/api/calendar";

export {
    checkEmail,
    collectToken,
    registerUser,
    getAuthData,
    verifyEmail,
    resendCode,
    connectCalendarAccount,
}