import axios from "axios"
import { apiConfig } from "../../config"
import storage from "../../utils/storage"

const axiosClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: apiConfig.headers
})

axiosClient.interceptors.response.use(
  (response) => {
    if (response !== undefined && response.data !== undefined) {
      // get all response
      return response
    }
    return response
  },
  (error) => {
    // // Internal Server
    // if (error.response && error.response.status === 500) {
    //   window.location.href = "/auth/500";
    // }

    // Refresh token is expired
    if (error.response && error.response.status === 404) {
      storage.clearToken();
      storage.clearUserInfo();
      storage.getRefreshToken();
      window.location.href = "/home";
    }

    // // Unauthorized
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized error:", error)
      throw new Error("Either email address or password is incorrect. Please try again")
    }

    // // Bad request
    // if (error.response && error.response.status === 400) {
    //   console.error("Bad request:", error);
    //   throw new Error(error);
    // }

    // handle error
    throw error
  }
)

export const get = (url, params = {}) => {
  return axiosClient.get(url, { params })
}

export default axiosClient
