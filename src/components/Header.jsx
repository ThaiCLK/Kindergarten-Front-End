import React, { useState } from "react"
import "../assets/scss/3-components/_header.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import LogoutModal from "../components/auth/Logout"
import { useNavigate } from "react-router-dom"

function Header() {
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const navigate = useNavigate()

    function handleSignOut() {
        setShowLogoutModal(true)
    }

    function handleLogout() {
        localStorage.removeItem("account")
        window.location = "/"
    }

    function handleCloseLogoutModal() {
        setShowLogoutModal(false)
    }

    function handleNewSchool() {
        localStorage.setItem("selectedItem", "school");
        navigate("/school-management/add-new-school");
    }

    return (
        <header className="header">
            <button className="new-school2" style={{ marginLeft: "20px" }} onClick={handleNewSchool}>
                <FontAwesomeIcon icon={faCirclePlus} />
                <b className="text">New school</b>
            </button>
            <div className="logout" style={{ alignItems: "center" }}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span onClick={handleSignOut} className="logout-text">
                    Logout
                </span>
            </div>
            <LogoutModal show={showLogoutModal} onClose={handleCloseLogoutModal} onLogout={handleLogout} />
        </header>
    )
}

export default Header
