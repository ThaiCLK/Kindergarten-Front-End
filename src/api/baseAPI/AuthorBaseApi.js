import axios from "axios"
import { apiConfig } from "../../config"
import storage from "../../utils/storage"
import AuthApi from "../AuthApi"

const axiosClient = axios.create({
    baseURL: apiConfig.baseURL,
    headers: apiConfig.headers
})

axiosClient.interceptors.request.use(async (config) => {
    // add token
    config.headers.Authorization = `Bearer ${storage.getToken()}`
    return config
})

axiosClient.interceptors.response.use(
    (response) => {
        if (response !== undefined && response.data !== undefined) {
            // only get data
            return response.data
        }
        return response
    },
    async (error) => {
        console.error(error)

        // // Not Found
        if (error.response && error.response.status === 404) {
            window.location.href = "/auth/404"
        }

        // token is expired
        if (error.response && error.response.status === 401) {
            const originalRequest = error.config
            await AuthApi.refreshToken()
            return axiosClient(originalRequest)
        }

        // No Authorization
        if (error.response && error.response.status === 403) {
            window.location.href = "/auth/403";
        }

        // Internal Server
        if (error.response && error.response.status === 500) {
            window.location.href = "/auth/500";
        }

        // handle error
        throw error
    }
)

export default axiosClient
