import React, { useEffect, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import "../../assets/scss/3-components/_createNewUserComponent.scss"
import LayoutComponents from "../common/LayoutComponents"
import UserAPI from "../../api/UserApi"
import { formatDateForInput, formatRoleName } from "../../utils/fomatUtils"
import { validateFullName, validateEmail, validateDob, validatePhone, validateRoleId } from "../../utils/Validate"
import { message } from "antd"
import { ToastContainer } from "react-toastify"
import { EXCEPTION_MESSAGE_CODE_7 } from "../../constants"
import { notifyException } from "../../utils/Notify"

function CreateNewUserComponent() {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        userName: "",
        fullName: "",
        email: "",
        dob: "",
        phone: "",
        roleId: "1",
        status: "Active"
    })

    const [errors, setErrors] = useState({})
    const [messageApi, contextHolder] = message.useMessage()
    const [backendErrors, setBackendErrors] = useState({})
    const [userRoles, setUserRoles] = useState({})


    useEffect(() => {
        async function fetchUserRole() {
            const roles = await UserAPI.getUserRole();
            setUserRoles(roles)
            console.log(roles);
        }
        fetchUserRole()
    }, [])

    const success = () => {
        messageApi.open({
            type: "success",
            content: "User Created Successfully!!!",
            duration: 1
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        let error = "";
        switch (name) {
            case "fullName":
                error = validateFullName(value);
                break;
            case "email":
                error = validateEmail(value);
                break;
            case "dob":
                error = validateDob(value);
                break;
            case "phone":
                error = validatePhone(value);
                break;
            case "roleId":
                error = validateRoleId(value);
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));

        if (name === "fullName") {
            if (value.trim() === "") {
                setUser((prevState) => ({
                    ...prevState,
                    userName: "Full Name can not be blank",
                }));
            } else {
                UserAPI.createUsernameFromFullName(encodeURIComponent(value))
                    .then((userName) => {
                        setUser((prevState) => ({
                            ...prevState,
                            userName: userName,
                        }));
                    })
                    .catch((error) => {
                        console.error("Error creating userName:", error);
                    });
            }
        }
    };


    const validateInputs = () => {
        const newErrors = {}

        newErrors.fullName = validateFullName(user.fullName)
        newErrors.email = validateEmail(user.email)
        newErrors.dob = validateDob(user.dob)
        newErrors.phone = validatePhone(user.phone)
        newErrors.role = validateRoleId(user.roleId)

        setErrors(newErrors)

        return Object.keys(newErrors).every((key) => newErrors[key] === null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateInputs()) return

        try {
            const formattedUser = {
                ...user,
                dob: formatDateForInput(user.dob)
            }
            await UserAPI.createNewUser(formattedUser)
            setUser({
                userName: "",
                fullName: "",
                email: "",
                dob: "",
                phone: "",
                roleId: ""
            })

            success()

            navigate("/user-management/user-list", {
                state: { createNewUserSuccess: true },
            });
        } catch (error) {
            const err = error.response.data.exception
            if (error.response && error.response.data) {
                const { exception } = error.response.data
                const backendErrors = {}

                Object.keys(exception).forEach((key) => {
                    backendErrors[key] = exception[key]
                })

                setBackendErrors(backendErrors)
            } else {
                console.error("Error create user:", error)
            }

            if (error.response.data.code === 7) {
                // Hiển thị lỗi tương ứng
                Object.keys(err).forEach((field) => {
                    if (EXCEPTION_MESSAGE_CODE_7[field]) {
                        notifyException(EXCEPTION_MESSAGE_CODE_7[field], "error")
                    }
                })
            } else if (error.response.data.code === 11) {
                notifyException(error.response.data.message, "warn")
            } else {
                notifyException(err, "warn")
            }
        }
    }

    const handleCancel = () => {
        setUser({
            userName: "",
            fullName: "",
            email: "",
            dob: "",
            phone: "",
            roleId: "",
            status: ""
        })
        navigate("/user-management/user-list")
    }

    return (
        <LayoutComponents title={"Add new user"}>
            <Container>
                <Form onSubmit={handleSubmit}>
                    <div style={{ margin: "60px 100px" }}>
                        <Row className="inputItem">
                            <Form.Label
                                style={{
                                    textAlign: "left",
                                    fontWeight: "bolder"
                                }}
                                column
                                sm={2}
                            >
                                User Name*
                            </Form.Label>
                            <Col>
                                <Form.Control
                                    type="text"
                                    name="userName"
                                    value={user.userName}
                                    onChange={handleChange}
                                    placeholder="User name will be auto-generated by system"
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row className="inputItem">
                            <Form.Label
                                style={{
                                    textAlign: "left",
                                    fontWeight: "bolder"
                                }}
                                column
                                sm={2}
                            >
                                Full Name*
                            </Form.Label>
                            <Col>
                                <Form.Control
                                    type="text"
                                    name="fullName"
                                    value={user.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter Full Name Here..."
                                    isInvalid={!!errors.fullName || !!backendErrors.fullName}
                                />
                                <Form.Control.Feedback type="invalid" id="error_fullname" >
                                    {errors.fullName || backendErrors.fullName}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                        <Row className="inputItem">
                            <Form.Label
                                style={{
                                    textAlign: "left",
                                    fontWeight: "bolder"
                                }}
                                column
                                sm={2}
                            >
                                Email*
                            </Form.Label>
                            <Col>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    placeholder="Enter User Email Here..."
                                    isInvalid={!!errors.email || !!backendErrors.email}
                                />
                                <Form.Control.Feedback type="invalid" id="error_email">
                                    {errors.email || backendErrors.email}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                        <Row className="inputItem">
                            <Form.Label
                                style={{
                                    textAlign: "left",
                                    fontWeight: "bolder"
                                }}
                                column
                                sm={2}
                            >
                                DOB*
                            </Form.Label>
                            <Col>
                                <Form.Control
                                    type="date"
                                    name="dob"
                                    value={user.dob}
                                    onChange={handleChange}
                                    placeholder="MM/DD/YYYY"
                                    isInvalid={!!errors.dob || !!backendErrors.dob}
                                />
                                <Form.Control.Feedback type="invalid" id="error_dob">
                                    {errors.dob || backendErrors.dob}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                        <Row className="inputItem">
                            <Form.Label
                                style={{
                                    textAlign: "left",
                                    fontWeight: "bolder"
                                }}
                                column
                                sm={2}
                            >
                                Phone No*
                            </Form.Label>
                            <Col>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={user.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number here..."
                                    isInvalid={!!errors.phone || !!backendErrors.phone}
                                />
                                <Form.Control.Feedback type="invalid" id="error_phone">
                                    {errors.phone || backendErrors.phone}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                        <Row className="inputItem">
                            <Form.Label
                                style={{
                                    textAlign: "left",
                                    fontWeight: "bolder"
                                }}
                                column
                                sm={2}
                            >
                                Role*
                            </Form.Label>
                            <Col>
                                <Form.Select
                                    name="roleId"
                                    onChange={handleChange}
                                    isInvalid={!!errors.role || !!backendErrors.role}
                                >
                                    {Array.isArray(userRoles) && userRoles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {formatRoleName(role.name)}
                                        </option>
                                    ))}

                                </Form.Select>
                                <Form.Control.Feedback type="invalid" id="error_role">
                                    {errors.role || backendErrors.role}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                        <Row className="inputItem">
                            <Form.Label
                                style={{
                                    textAlign: "left",
                                    fontWeight: "bolder"
                                }}
                                column
                                sm={2}
                            >
                                Status
                            </Form.Label>
                            <Col>
                                <Form.Select name="status" value={user.status || "Active"} onChange={handleChange}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        <div
                            style={{
                                display: "flex",
                                marginTop: "35px",
                                justifyContent: "end"
                            }}
                        >
                            <React.Fragment>
                                <Button
                                    className="buttonWhite"
                                    style={{
                                        marginRight: "40px",
                                        width: "130px"
                                    }}
                                    variant="secondary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </React.Fragment>

                            <React.Fragment>
                                <ToastContainer />
                                {contextHolder}
                                <Button type="submit" style={{ width: "130px" }} variant="primary">
                                    Create
                                </Button>
                            </React.Fragment>
                        </div>
                    </div>
                </Form>
            </Container>
        </LayoutComponents>
    )
}

export default CreateNewUserComponent
