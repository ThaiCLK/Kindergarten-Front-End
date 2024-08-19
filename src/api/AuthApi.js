import storage from "../utils/storage"
import UnauthorApi from "./baseAPI/UnauthorBaseApi"

class AuthAPI {
    constructor() {
        this.url = "/auth"
    }

    // Login method: sends email and password to the login endpoint
    login = (email, password) => {
        const body = {
            email: email,
            password: password
        }
        return UnauthorApi.post(`${this.url}/login`, body)
    }

    // Logout method: sends refreshToken to logout endpoint
    logout = (refreshToken) => {
        const body = {
            refreshToken: refreshToken
        }
        return UnauthorApi.post(`${this.url}/logout`, body)
    }

    // Forgot Password method: sends an email to reset the password
    forgotPassword = (email) => {
        const body = {
            email: email
        }
        return UnauthorApi.post(`${this.url}/forgot`, body)
    }

    // Verify Token method: verifies the reset password token
    verifyToken = (token) => {
        return UnauthorApi.get(`${this.url}/reset/${token}`)
    }

    // Reset Password method: resets the password using the token
    resetPassword = async (password, confirmPassword, token) => {
        const body = { password: password, confirmPassword: confirmPassword }
        return UnauthorApi.put(`${this.url}/reset/${token}`, body)
    }

    // Refresh Token method: requests a new access token using the refresh token
    refreshToken = async () => {
        try {
            const token = storage.getRefreshToken()
            const body = token.toString() // Chuyển đổi token thành chuỗi

            const response = await UnauthorApi.post(`/auth/refreshToken`, body, {
                headers: {
                    "Content-Type": "text/plain" // Đặt Content-Type là text/plain
                }
            })
            const newToken = response.data.token
            const newRefreshToken = response.data.refreshToken
            storage.clearToken()
            storage.saveNewTokenInfo(newToken, newRefreshToken)
        } catch (error) {
            console.error("Error during token refresh:", error)

            // No Refresh Token
            if (error.response && error.response.data.status === 400) {
                window.location.href = "/home";
            }

            // Refresh token is expried
            if (error.response && error.response.data.status === 404) {
                window.location.href = "/home";
            }

        }
    }

    // Sign Up method: registers a new user with the provided details
    signUp = (fullName, email, phone, password, confirmPassword) => {
        const body = {
            fullName: fullName,
            email: email,
            phone: phone,
            password: password,
            confirmPassword: confirmPassword
        }
        return UnauthorApi.post(`${this.url}/register`, body, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    // Resend Active Account Email method: sends a verification email to the username
    resendActiveAccountEmail = (username) => {
        return UnauthorApi.get(`${this.url}/registration/active-mail?username=${username}`)
    }
}

export default new AuthAPI()
