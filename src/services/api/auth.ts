import {privateInstance, publicInstance} from "@/services/api/instance";
import {isAxiosError} from "axios";
import {AuthData, AuthResponseData} from "@/types";


const storeCreds = (access: string, refresh: string) => {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
}

const checkEmail = async (email: string) => {
    try {
        const result = await publicInstance.post(
            '/auth/email-check/',
            {email}
        )
        return result.data
    } catch (error) {
        if (isAxiosError(error)) {
            if ([400, 404].includes(error.response?.status || 0)) {
                return Promise.reject({
                    status: error.response?.status,
                    data: error.response?.data
                })
            }
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
}

const registerUser = async ({email, fullName, password, repeatPassword}:{email: string, fullName: string, password: string, repeatPassword: string}) => {
    try {
        const result = await publicInstance.post<AuthResponseData>(
            '/auth/register/',
            {
                email,
                fullName,
                password,
                repeatPassword
            }
        )
        storeCreds(result.data.credentials.access, result.data.credentials.refresh)
        return result.data.user
    } catch (error) {
        if (isAxiosError(error)) {
            if ([400, 404].includes(error.response?.status || 0)) {
                return Promise.reject({
                    status: error.response?.status,
                    data: error.response?.data
                })
            }
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
}


const collectToken = async (email: string, password: string) => {
    try {
        const result = await publicInstance.post<AuthResponseData>(
            '/auth/token/',
            {email, password}
        )
        storeCreds(result.data.credentials.access, result.data.credentials.refresh)
        return result.data.user
    } catch (error) {
        if (isAxiosError(error)) {
            if ([400, 404, 401].includes(error.response?.status || 0)) {
                return Promise.reject({
                    status: error.response?.status,
                    data: error.response?.data
                })
            }
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
}

const googleLogin = async (code: string) => {
    console.log('code', code)
    try {
        const result = await publicInstance.post<AuthResponseData>(
            '/auth/google/',
            {code}
        )
        storeCreds(result.data.credentials.access, result.data.credentials.refresh)
        return result.data.user
    } catch (error) {
        if (isAxiosError(error)) {
            if ([400, 404, 401].includes(error.response?.status || 0)) {
                return Promise.reject({
                    status: error.response?.status,
                    data: error.response?.data
                })
            }
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
}

const verifyEmail = async (code: string) => {
    try {
        const result = await privateInstance.post<AuthData>(
            '/auth/verify-email/',
            {code}
        )
        return result.data
    } catch (error) {
        if (isAxiosError(error)) {
            if ([400, 404, 401].includes(error.response?.status || 0)) {
                return Promise.reject({
                    status: error.response?.status,
                    data: error.response?.data
                })
            }
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
}


const resendCode = async () => {
    try {
        const result = await privateInstance.patch(
            '/auth/resend-code/',
        )
        return result.data
    } catch (error) {
        if (isAxiosError(error)) {
            if ([400, 404, 401].includes(error.response?.status || 0)) {
                return Promise.reject({
                    status: error.response?.status,
                    data: error.response?.data
                })
            }
        }
        return Promise.reject({
            status: 500,
            reason: 'Internal Server Error'
        })
    }
}


export {
    checkEmail,
    collectToken,
    registerUser,
    verifyEmail,
    resendCode,
    googleLogin
}