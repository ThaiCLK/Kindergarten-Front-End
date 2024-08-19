import React, { useState } from "react"
import { Form, Button, Col, Row, Container } from "react-bootstrap"
import { MdEmail } from "react-icons/md"
import { motion } from "framer-motion"
import AuthApi from "../../api/AuthApi"
import { toast, ToastContainer, Bounce } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { validateEmail } from "../../utils/Validate"

const ForgotPassword = ({ onClose }) => {
    const [email, setEmail] = useState("")
    const [errors, setErrors] = useState({})
    const [successMessage, setSuccessMessage] = useState("")
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [backendErrors, setBackendErrors] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault()
        let formErrors = {}

        if (!email) formErrors.email = validateEmail(email)

        setErrors(formErrors)

        if (Object.keys(formErrors).length === 0) {
            try {
                setSuccessMessage("")
                setErrors({})
                setIsButtonDisabled(true)

                const response = await AuthApi.forgotPassword(email)

        if (response.status === 200) {
          toast.success(
            "A password reset email has been sent to your email address.",
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
          setTimeout(() => setIsButtonDisabled(false), 60000);
        } else {
          throw new Error("Invalid email");
        }
      } catch (error) {
        if (error.response && error.response.data) {
          const { exception } = error.response.data;
          const backendErrors = {};

                    Object.keys(exception).forEach((key) => {
                        backendErrors[key] = exception[key]
                    })
                    setBackendErrors(backendErrors)
                    setIsButtonDisabled(false)
                }
            }
        }
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
        setErrors({})
        setSuccessMessage("")
        setBackendErrors("")
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
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
            <Container className="centered-container">
                <div className="border rounded padded-container">
                    <h3 className="text-center pb-3">
                        <b>Forgot Password</b>
                    </h3>
                    <div className="text-muted text-center pt-2">
                        <p style={{ fontSize: 13 }}>
                            Please enter your email address and we’ll send you a <br /> link to reset your account
                        </p>
                    </div>
                    <Form className="form-forgot-style" onSubmit={handleSubmit}>
                        <Form.Group className="m-3 pt-3 email-input-group" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <div className="input-with-icon mb-4">
                                <MdEmail className="email-icon" />
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className="form-control-style"
                                    isInvalid={!!errors.email || !!backendErrors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email || backendErrors.email}
                                </Form.Control.Feedback>
                            </div>

                            {successMessage && (
                                <div style={{ color: "green" }} className="mt-3">
                                    {successMessage}
                                </div>
                            )}
                        </Form.Group>
                        <Row className="p-3">
                            <Col>
                                <Button variant="outline-primary" className="py-2 button-style" onClick={onClose}>
                                    <b>Cancel</b>
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="primary"
                                    className="py-2 button-style"
                                    type="submit"
                                    disabled={isButtonDisabled}
                                >
                                    <b>Submit</b>
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Container>
        </motion.div>
    )
}

export default ForgotPassword
