import React, { useState, useEffect } from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import AuthApi from "../../api/AuthApi"
import { validatePassword, validateConfirmPassword } from "../../utils/Validate"
import { ToastContainer, toast, Bounce } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { notifyException } from "../../utils/Notify"

const ResetPassword = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [tokenValid, setTokenValid] = useState(false)
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const { token } = useParams()
    const [backendErrors, setBackendErrors] = useState({})

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await AuthApi.verifyToken(token)

                if (response.status !== 200) {
                    throw new Error("Invalid or expired token")
                }

                setTokenValid(true)
            } catch (error) {
                console.error("Error verifying token:", error)
                setErrors({ token: error.message })
                notifyException(error.message, "error")
            }
        }

        if (token) {
            verifyToken()
        } else {
            const errorMsg = "No token provided"
            setErrors({ token: errorMsg })
            notifyException(errorMsg, "error")
        }
    }, [token])

    const handleInputChange = (setter, field) => (e) => {
        setter(e.target.value)
        setErrors((prevErrors) => ({ ...prevErrors, [field]: null }))
        setBackendErrors((prevErrors) => ({ ...prevErrors, [field]: null }))
    }

    useEffect(() => {
        if (password && confirmPassword) {
            const passwordError = validatePassword(password)
            const confirmPasswordError = validateConfirmPassword(password, confirmPassword)
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: passwordError,
                confirmPassword: confirmPasswordError
            }))
        }
    }, [password, confirmPassword])

    const handleSubmit = async (e) => {
        e.preventDefault()
        let formErrors = {}

        const passwordError = validatePassword(password)
        if (passwordError) formErrors.password = passwordError

        const confirmPasswordError = validateConfirmPassword(password, confirmPassword)
        if (confirmPasswordError) formErrors.confirmPassword = confirmPasswordError

        setErrors(formErrors)

        if (Object.keys(formErrors).length === 0) {
            try {
                const response = await AuthApi.resetPassword(password, confirmPassword, token)
                if (response.status === 200) {
                    setPassword("")
                    setConfirmPassword("")
                    toast.success(
                        "Your password has been reset successfully.",
                        {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            theme: "light",
                            transition: Bounce,
                        }
                    );

                    setTimeout(() => {
                        navigate("/")
                    }, 2000)
                } else {
                    throw new Error("Please enter your password");
                }
            } catch (error) {
                console.error("Error resetting password:", error)
                const errorMsg = error.message || "There was an issue resetting your password. Please try again."
                setErrors({
                    server: errorMsg
                })
                notifyException(errorMsg, "error")
            }
        }
    }

    return (
        <div className="overlay-bg">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="animation"
            >
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover={false}
                    theme="light"
                    transition={Bounce}
                />
                <div className="border rounded container-border">
                    <div className="p-1">
                        <h2>
                            <b>Reset Password</b>
                        </h2>
                    </div>
                    <div className="text-muted pb-2" style={{ fontSize: 15 }}>
                        Please set your new password
                    </div>
                    <div>
                        {errors.token ? (
                            <div style={{ color: "red" }} className="mt-3">
                                {errors.token}
                            </div>
                        ) : tokenValid ? (
                            <Form className="form-style" onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        className={`form-control ${errors.password && "is-invalid"} form-control-style`}
                                        value={password}
                                        onChange={handleInputChange(setPassword, "password")}
                                    />
                                    {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
                                    <div style={{ margin: '0 55px 0 0' }}>
                                        <Form.Text muted>
                                            <i style={{ fontSize: 13 }}>
                                                Use at least one letter, one number and seven characters.
                                            </i>
                                        </Form.Text>
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="confirm_password">
                                    <Form.Label>Confirm Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm password"
                                        className={`form-control ${errors.confirmPassword && "is-invalid"} form-control-style`}
                                        value={confirmPassword}
                                        onChange={handleInputChange(setConfirmPassword, "confirmPassword")}
                                    />
                                    {errors.confirmPassword && (
                                        <Form.Text className="text-danger">{errors.confirmPassword}</Form.Text>
                                    )}
                                </Form.Group>

                                <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '20px 10px 0 0' }}>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => navigate("/")}

                                        style={{ fontSize: 20, padding: '13px 40px' }}
                                    >
                                        <b>Cancel</b>
                                    </Button>

                                    <Button variant="primary" type="submit" style={{ fontSize: 20, padding: '13px 43px' }}>
                                        <b>Reset</b>
                                    </Button>
                                </div>
                            </Form>
                        ) : (
                            <div>Loading...</div>
                        )}
                    </div>
                </div>
            </motion.div >
        </div >
    )
}

export default ResetPassword
