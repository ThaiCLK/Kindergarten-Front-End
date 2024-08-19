// Auth.jsx
import { useSelector } from "react-redux"
import { selectIsLogin } from "../redux/selector/UserInfoSelector"
import { Navigate } from "react-router-dom"

const Auth = ({ children }) => {
    const isLogin = useSelector(selectIsLogin)


    if (!isLogin) {
        return <Navigate to="/home" />;
    }

    return children
}

export default Auth;
