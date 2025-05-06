import axios from "axios";

axios.defaults.withCredentials = true;

const publicInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});
const privateInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

privateInstance.interceptors.request.use(config => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
        config.headers["Authorization"] = "Bearer " + accessToken;
    }
    return config;
})

privateInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refresh");
            if (refreshToken) {
                try {
                    const response = await publicInstance.post("/auth/token/refresh/", {
                        refresh: refreshToken
                    });
                    const newAccessToken = response.data.access;
                    localStorage.setItem("access", newAccessToken);
                    return privateInstance(originalRequest);
                } catch (error) {
                    console.error("Error refreshing token", error);
                }
            }
        }
        return Promise.reject(error);
    }
)


export {
    publicInstance,
    privateInstance
}