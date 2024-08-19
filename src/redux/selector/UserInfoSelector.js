// redux/selectors/UserInfoSelector.js
import storage from "../../utils/storage"

export const selectIsLogin = () => !!storage.getToken() && !!storage.getRefreshToken()
export const selectRole = () => storage.getUserInfo()?.role
export const selectUser = () => storage.getUserInfo()
