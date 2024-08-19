import React from "react"
import { connect } from "react-redux"
import { selectIsLogin, selectRole } from "../redux/selector/UserInfoSelector"
import { Navigate } from "react-router-dom"
import { ROLE } from "../constants"

function AdminAuth(props) {
    if (!props.isLogin) {
        return <Navigate to="/" />
    }

    if (props.role !== ROLE.ADMIN) {
        return <Navigate to="/auth/403" />
    }

    return <>{props.children}</>
}

const mapStateToProps = (state) => ({
    isLogin: selectIsLogin(state),
    role: selectRole(state)
})

export default connect(mapStateToProps)(AdminAuth)
