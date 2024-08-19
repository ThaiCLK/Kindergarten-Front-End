import React from "react"
import { connect } from "react-redux"
import { selectIsLogin, selectRole } from "../redux/selector/UserInfoSelector"
import { Navigate } from "react-router-dom"
import { ROLE } from "../constants"

function ParentAuth(props) {
    if (!props.isLogin) {
        return <Navigate to="/home" />
    }

    if (props.role !== ROLE.PARENT) {
        return <Navigate to="/auth/404" />
    }

    return <>{props.children}</>
}

const mapStateToProps = (state) => ({
    isLogin: selectIsLogin(state),
    role: selectRole(state)
})

export default connect(mapStateToProps)(ParentAuth)