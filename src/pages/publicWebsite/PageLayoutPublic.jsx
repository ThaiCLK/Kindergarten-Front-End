import Header from "../../components/HeaderPublic"
import { Container, Row } from "react-bootstrap"
import Footer from "../../components/Footer"
import { Outlet, useLocation } from "react-router-dom"
import React, { useEffect, useState } from "react"
import "../../assets/scss/Landing.scss"
import "bootstrap/dist/css/bootstrap.css"
import SignUp from "../../components/auth/SignUp"
import Login from "../../components/auth/LoginGuest"
import Breadcrumbs from "../../components/common/Breadcrumbs"
import '../../assets/scss/_pageLayoutPublic.scss'

function PageLayoutPublic() {
    const [showLogin, setShowLogin] = useState(false)
    const [showSignUp, setShowSignUp] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [currentLocation, setCurrentLocation] = useState('');
    const location = useLocation();

    useEffect(() => {
        setCurrentLocation(location.pathname);
    }, [location])

    useEffect(() => {
        const isLog = localStorage.getItem("isLog") == "true"
        if (isLog) {
            setShowLogin(true)
        }
        localStorage.removeItem("isLog")
    }, [])

    const handleLogin = () => {
        setShowLogin(true)
        setShowSignUp(false)
        setShowProfile(false)
    }

    const handleCloseLogin = () => {
        setShowLogin(false)
    }

    const handleSignUp = () => {
        setShowSignUp(true)
        setShowLogin(false)
        setShowProfile(false)
    }

    const handleCloseSignUp = () => {
        setShowSignUp(false)
    }

    const handleShowLoginAfterSignUp = () => {
        setShowSignUp(false)
        setShowLogin(true)
    }

    const handleProfileClick = () => {
        setShowProfile(true)
        setShowLogin(false)
        setShowSignUp(false)
    }

    return (
        <div className="page-container">
            <Header handleLogin={handleLogin} handleSignUp={handleSignUp} handleProfileClick={handleProfileClick} />
            <div className="content-wrap">
                <Outlet />
            </div>
            <Footer />
            {showLogin && <Login show={showLogin} onClose={handleCloseLogin} onSignUpClick={handleSignUp} />}
            {showSignUp && (
                <SignUp show={showSignUp} onClose={handleCloseSignUp} onShowLogin={handleShowLoginAfterSignUp} />
            )}
        </div>
    )
}

export default PageLayoutPublic
