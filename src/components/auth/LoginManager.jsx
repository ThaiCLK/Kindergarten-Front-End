import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthAPI from "../../api/AuthApi";
import storage from "../../utils/storage";
import ForgotPassword from "./ForgotPassword";
import { useDispatch } from "react-redux";
import { loginWithEmail } from "../../redux/reducers/UserInfoSlice";
import { jwtDecode } from "jwt-decode";
import { validateEmail } from "../../utils/Validate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/scss/Icons.scss";

function LoginManager({ show }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (!show) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};

        if (!email) {
            formErrors.email = "This field is required";
        } else {
            const emailError = validateEmail(email);
            if (emailError) formErrors.email = emailError;
        }

        if (!password) {
            formErrors.password = "This field is required";
        }

        setErrors(formErrors);

        if (Object.keys(formErrors).length === 0) {
            try {
                const response = await AuthAPI.login(email, password);
                if (response && response.data.token && response.data.refreshToken) {
                    const decodedToken = jwtDecode(response.data.token);
                    const { email, role } = decodedToken;

                    if (role !== "PARENT") {
                        storage.saveNewTokenInfo(
                            response.data.token,
                            response.data.refreshToken
                        );
                        storage.setUserInfo({ email, role });
                        dispatch(loginWithEmail({ email, role }));

                        handleLoginModalClose();
                        navigate("/school-management/school-list", {
                            state: { loginSuccess: true },
                        });
                    } else {
                        toast.error("Either email address or password is incorrect. Please try again");
                    }
                } else {
                    throw new Error("Invalid email or password");
                }
            } catch (error) {
                console.error("Login error:", error);
                setGeneralError(error.message);
            }
        }
    };


    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setGeneralError("");

        if (value) {
            setErrors((prevErrors) => {
                const { email, ...rest } = prevErrors;
                return rest;
            });
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setGeneralError("");

        if (value) {
            setErrors((prevErrors) => {
                const { password, ...rest } = prevErrors;
                return rest;
            });
        }
    };

    const handleForgotPassword = () => {
        setShowForgotPassword(true);
    };

    const handleLoginModalClose = () => {
        setShowForgotPassword(false);
        setErrors({});
        setEmail("");
        setPassword("");
        setGeneralError("");
    };

    return (
        <div className="overlay-bg">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="animation"
            >
                {!showForgotPassword && (
                    <div className="border rounded container-border position-relative">
                        <div>
                            <h2 className="py-3">
                                <b>Login into your account</b>
                            </h2>
                        </div>
                        <div>
                            <Form onSubmit={handleSubmit} className="form-style">
                                <Form.Group
                                    className="mb-3 email-input-group"
                                    controlId="formBasicEmail"
                                >
                                    <Form.Label>Email address</Form.Label>
                                    <div className="input-with-icon">
                                        <MdEmail className="email-icon" />
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            required
                                            className={`form-control ${errors.email && "is-invalid"
                                                } form-control-style`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <Form.Text className="text-danger">
                                            {errors.email}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                <Form.Group
                                    className="mb-3 password-input-group"
                                    controlId="formBasicPassword"
                                >
                                    <Form.Label>Password</Form.Label>
                                    <div className="input-with-icon">
                                        <RiLockPasswordFill className="password-icon" />
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            className={`form-control ${errors.password && "is-invalid"
                                                } form-control-style`}
                                            autoComplete={password}
                                        />
                                    </div>
                                    {errors.password && (
                                        <Form.Text className="text-danger">
                                            {errors.password}
                                        </Form.Text>
                                    )}
                                </Form.Group>

                                {generalError && (
                                    <Form.Text className="text-danger mb-3">
                                        {generalError}
                                    </Form.Text>
                                )}

                                <Form.Group className="mb-3 forgotpass">
                                    <button
                                        type="button"
                                        className="btn btn-link forgotpass-button my-2"
                                        onClick={handleForgotPassword}
                                    >
                                        Forgot password?
                                    </button>
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="d-block login-signup-button1 mx-auto mt-3"
                                >
                                    <b>Login now</b>
                                </Button>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        margin: "35px 0",
                                    }}
                                ></div>
                            </Form>
                        </div>
                    </div>
                )}
                {showForgotPassword && (
                    <ForgotPassword onClose={handleLoginModalClose} />
                )}
            </motion.div>
            <ToastContainer />
        </div>
    );
}

export default LoginManager;
