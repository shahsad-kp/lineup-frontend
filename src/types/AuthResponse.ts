import {AuthData} from "@/types/AuthData";

export type AuthResponseData = {
    user: AuthData,
    credentials: {
        access: string,
        refresh: string,
    }
}