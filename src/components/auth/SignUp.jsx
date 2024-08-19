import React, { useState, useEffect } from "react"
import { Form, Button, Row, Col, CloseButton } from "react-bootstrap"
import { motion } from "framer-motion"
import AuthAPI from "../../api/AuthApi"
import {
    validateFullName,
    validateEmail,
    validatePhone,
    validatePassword,
    validateConfirmPassword
} from "../../utils/Validate"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { notifyException } from "../../utils/Notify"
import TermsModal from "../common/TermsandConditions"
import { EXCEPTION_MESSAGE_CODE_7 } from "../../constants"

const SignUp = ({ show, onClose, onShowLogin }) => {
    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [successMessage, setSuccessMessage] = useState("")
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [showTermsModal, setShowTermsModal] = useState(false)
    const [backendErrors, setBackendErrors] = useState({})

    useEffect(() => {
        if (show) {
            setFullname("")
            setEmail("")
            setPhone("")
            setPassword("")
            setConfirmPassword("")
            setErrors({})
            setSuccessMessage("")
            setTermsAccepted(false)
        }
    }, [show])

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

    const handleTermsAccept = () => {
        setTermsAccepted(true)
        setShowTermsModal(false)
    }

    const handleSubmit = async () => {
        if (!termsAccepted) {
            setShowTermsModal(true)
            return
        }
        let formErrors = {}

        const validateField = (fieldName, value, validationFn) => {
            if (!value) {
                formErrors[fieldName] = "This field is required";
            } else {
                const error = validationFn(value);
                if (error) formErrors[fieldName] = error;
            }
        };

        validateField("fullname", fullname, validateFullName);
        validateField("email", email, validateEmail);
        validateField("phone", phone, validatePhone);
        validateField("password", password, validatePassword);
        validateField("confirmPassword", confirmPassword, (value) =>
            validateConfirmPassword(password, value)
        );

        setErrors(formErrors);
        if (Object.keys(formErrors).length === 0 && termsAccepted) {
            try {
                const response = await AuthAPI.signUp(fullname, email, phone, password, confirmPassword);
                if (response.status === 200) {
                    setSuccessMessage("Registration successful!");
                    setErrors({});
                    notifyException("Registration successful!", "success");
                    setTimeout(() => {
                        onShowLogin();
                    }, 1500);
                } else {
                    setErrors({});
                    notifyException("Registration fail!", "error");
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    const { exception } = error.response.data;
                    const backendErrors = {};

                    Object.keys(exception).forEach((key) => {
                        backendErrors[key] = exception[key];
                    });
                    setBackendErrors(backendErrors);

                    if (error.response.data.code === 7) {
                        // Display specific error messages
                        Object.keys(exception).forEach((field) => {
                            if (EXCEPTION_MESSAGE_CODE_7[field]) {
                                notifyException(EXCEPTION_MESSAGE_CODE_7[field], "error")
                            }
                        })
                    } else if (error.response.data.code === 11) {
                        notifyException(error.response.data.message, "warn")
                    } else {
                        notifyException(exception, "warn")
                    }
                } else {
                    console.error("Error details:", error.message)
                    notifyException("Registration failed. Please try again.", "error")
                }
            }
        }
    }

    const handleSignUpModalClose = () => {
        onClose()
        setErrors({})
        setFullname("")
        setEmail("")
        setPhone("")
        setPassword("")
        setConfirmPassword("")
        setSuccessMessage("")
        setTermsAccepted(false)
    }

    const handleInputChange = (setter, field) => (e) => {
        setter(e.target.value)
        setErrors((prevErrors) => ({ ...prevErrors, [field]: null }))
        setBackendErrors((prevErrors) => ({ ...prevErrors, [field]: null }))
    }

    return (
        <div className="overlay-bg">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="animation"
            >
                <div className="border rounded container-border position-relative">
                    <div>
                        <h2 className="py-1">
                            <b>Create a new user</b>
                        </h2>
                        <CloseButton onClick={handleSignUpModalClose} className="position-absolute top-0 end-0 m-4" />
                    </div>
                    <div>
                        <Form className="form-style">
                            <Form.Group className="mb-2" controlId="fullname">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your full name"
                                    className={`form-control ${errors.fullname && "is-invalid"} form-control-style`}
                                    value={fullname}
                                    onChange={handleInputChange(setFullname, "fullname")}
                                />
                                {errors.fullname && <Form.Text className="text-danger">{errors.fullname}</Form.Text>}
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="email">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    className={`form-control ${errors.email && "is-invalid"} form-control-style`}
                                    value={email}
                                    onChange={handleInputChange(setEmail, "email")}
                                    isInvalid={!!errors.email || !!backendErrors.email}
                                />
                                {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="phonenum">
                                <Form.Label>Mobile No.</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your phone number (+84)"
                                    className={`form-control ${errors.phone && "is-invalid"} form-control-style`}
                                    value={phone}
                                    onChange={handleInputChange(setPhone, "phone")}
                                    isInvalid={!!errors.phone || !!backendErrors.phone}
                                />
                                {errors.phone && <Form.Text className="text-danger">{errors.phone}</Form.Text>}
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="password">
                                <Form.Label>Password:</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    className={`form-control ${errors.password && "is-invalid"} form-control-style`}
                                    value={password}
                                    onChange={handleInputChange(setPassword, "password")}
                                />
                                {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
                                <div>
                                    <i className="text-muted" style={{ fontSize: "13px" }}>
                                        Use at least one number, one numeral, and seven characters
                                    </i>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="confirmPassword">
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

                            <div
                                className="text-muted"
                                style={{
                                    fontSize: "15px",
                                    display: "flex",
                                    alignItems: "center",
                                    margin: "15px 2px"
                                }}
                            >
                                <div>
                                    <b>By signing up, you agree with our</b>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-link term-and-con-button"
                                        onClick={() => setShowTermsModal(true)}
                                    >
                                        <b>Terms and Conditions</b>
                                    </button>
                                </div>
                            </div>
                            <Row className="pt-3 pb-2">
                                <Col>
                                    <Button
                                        variant="outline-primary"
                                        onClick={handleSignUpModalClose}
                                        className="button-style"
                                        style={{ marginLeft: "60px" }}
                                    >
                                        <b>Cancel</b>
                                    </Button>
                                </Col>
                                <Col className="text-center">
                                    <Button
                                        variant="primary"
                                        type="button"
                                        className="button-style d-flex justify-content-center"
                                        onClick={handleSubmit}
                                    >
                                        <b>Sign Up</b>
                                    </Button>
                                </Col>
                            </Row>
                            {errors.api && <div className="text-danger text-center mt-3">{errors.api}</div>}
                            {successMessage && <div className="text-success text-center mt-3">{successMessage}</div>}
                        </Form>
                        <ToastContainer />
                    </div>
                </div>
            </motion.div>
            <TermsModal show={showTermsModal} onAccept={handleTermsAccept} onClose={() => setShowTermsModal(false)} />
        </div>
    )
}

export default SignUp
