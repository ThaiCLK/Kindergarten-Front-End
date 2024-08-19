let authToken = ""
let refreshToken = ""

const storage = {
    getToken: () => authToken,
    getRefreshToken: () => refreshToken,
    saveNewTokenInfo: (token, newRefreshToken) => {
        authToken = token
        refreshToken = newRefreshToken
        // Lưu token và refreshToken vào localStorage
        localStorage.setItem("authToken", authToken)
        localStorage.setItem("refreshToken", refreshToken)
    },
    loadTokenFromStorage: () => {
        authToken = localStorage.getItem("authToken") || ""
        refreshToken = localStorage.getItem("refreshToken") || ""
    },
    clearToken: () => {
        authToken = ""
        refreshToken = ""
        localStorage.removeItem("authToken")
        localStorage.removeItem("refreshToken")
    },

    getUserInfo: () => {
        // Giả sử bạn lưu thông tin người dùng trong localStorage
        const userInfo = localStorage.getItem("userInfo")
        return userInfo ? JSON.parse(userInfo) : {}
    },
    setUserInfo: (userInfo) => {
        localStorage.setItem("userInfo", JSON.stringify(userInfo))
    },
    clearUserInfo: () => {
        localStorage.removeItem("userInfo")
    }
}

// Load token khi refresh trang
storage.loadTokenFromStorage()

export default storage
