import {privateInstance} from "@/services/api/instance";

const getAuthData = async () => {
    const result = await privateInstance.get('/auth/me/');
    return result.data
}

export {
    getAuthData
}