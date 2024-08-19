// src/components/Forbidden.js
import React from "react"
import { useNavigate } from "react-router-dom"
import "../../assets/scss/403.scss"
import { useDispatch } from "react-redux"
import { logout } from "../../redux/reducers/UserInfoSlice"

const Forbidden = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLoginRedirect = () => {
        dispatch(logout())
        navigate('/home')
    }

    return (
        <div className="lock-container">
            <div className="message" style={{ display: "contents" }}>
                <div className="lock"></div>
                <h1>Access to this page is restricted</h1>
                <p>Please check with the site admin if you believe this is a mistake.</p>
            </div>
            <button onClick={handleLoginRedirect} className="goback-button" style={{ padding: "13px", margin: "20px" }}>
                Go back to Homepage
            </button>
        </div>
    )
}

export default Forbidden
