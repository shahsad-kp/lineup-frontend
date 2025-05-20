import {privateInstance} from "@/services/api/instance";
import {ConnectCalendarData, Calendar} from "@/types";

const connectAccount = async (data: ConnectCalendarData) => {
    const result = await privateInstance.post<Calendar>('/calendar/connect/', data);
    return result.data
}


export {
    connectAccount
}