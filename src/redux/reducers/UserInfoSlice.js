import storage from "../../utils/storage"
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isAuthenticated: !!storage.getToken() && storage.getRefreshToken, // Kiểm tra xem có token không
    user: storage.getUserInfo() // Lấy thông tin người dùng từ localStorage
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginWithEmail: (state, action) => {
            state.isAuthenticated = true
            state.user = {
                email: action.payload.email,
                role: action.payload.role
            }
        },
        logout: (state) => {
            state.isAuthenticated = false
            state.user = null
            storage.clearToken()
            storage.clearUserInfo()
            localStorage.removeItem("selectedItem")
        }
    }
})

export const { loginWithEmail, logout } = authSlice.actions

export default authSlice.reducer
