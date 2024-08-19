// React and Hooks
import { React, useState } from "react"
import ReactDOM, { createRoot } from "react-dom/client"

// React Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import { Button, Col, Row, Form, Container, Modal } from "react-bootstrap"

// React Router
import { BrowserRouter, useNavigate } from "react-router-dom"

// React Icons
import { MdEmail } from "react-icons/md"
import { PiWarningCircleBold } from "react-icons/pi"
import { RiLockPasswordFill } from "react-icons/ri"

// SCSS
import "./assets/scss/Animation.scss"
import "./assets/scss/3-components/_auth.scss"

// Components
import App from "./App"
import LogoutModal from "./components/auth/Logout"
import Login from "./components/auth/LoginGuest"
import ForgotPassword from "./components/auth/ForgotPassword"
import ResetPassword from "./components/auth/ResetPassword"

// Animation
import { motion } from "framer-motion"

// Redux
import store from "./redux/store"
import { Provider } from "react-redux"

// App initialization
const container = document.getElementById("root")
const root = createRoot(container) // Tạo root bằng createRoot

root.render(
    <Provider store={store}>
        <App />
    </Provider>
)

export {
    React,
    useState,
    ReactDOM,
    Button,
    Col,
    Row,
    Form,
    Container,
    Modal,
    BrowserRouter,
    MdEmail,
    PiWarningCircleBold,
    RiLockPasswordFill,
    App,
    LogoutModal,
    Login,
    ForgotPassword,
    ResetPassword,
    motion,
    useNavigate
}
