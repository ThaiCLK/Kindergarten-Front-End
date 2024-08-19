// src/components/BadRequest.js
import React from "react"
import { useNavigate } from "react-router-dom"
import "../../assets/scss/3-components/_pageError.scss"

const BadRequest = () => {
    const navigate = useNavigate()

    const handleHomeRedirect = () => {
        navigate("/")
    }

    return (
        <div className="error-container">
            <h1>
                <b>400 - Bad Request</b>
            </h1>
            <p>The request could not be understood or was missing required parameters.</p>
            <button onClick={handleHomeRedirect} className="goback-button">
                Go back
            </button>
        </div>
    )
}

export default BadRequest
