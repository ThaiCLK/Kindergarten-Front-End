import React, { useEffect, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import LayoutComponents from "../common/LayoutComponents"
import { parseISO, format } from "date-fns"
import UserAPI from "../../api/UserApi"
import { validateFullName, validateEmail, validateDob, validatePhone, validateRoleId } from "../../utils/Validate"
import "../../assets/scss/3-components/_editUserAccount.scss"

function formatDateForInput(isoDate) {
    return isoDate ? isoDate.split("T")[0] : ""
}

function EditUserAccountComponent() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [user, setUser] = useState({
        userName: "",
        fullName: "",
        email: "",
        dob: "",
        phone: "",
        roleId: "",
        status: ""
    })

    const [errors, setErrors] = useState({})
    const [backendErrors, setBackendErrors] = useState({})
    const [duplicateError, setDuplicateError] = useState("")
    useEffect(() => {
        async function fetchUsersData() {
            const usersData = await UserAPI.getUserDetail(id);
            const modifiedDOB = convertDate(usersData.dob);
            setUser({ ...usersData, dob: modifiedDOB });
            console.log("Ngày sinh đã đổi: ", modifiedDOB);
        }

        fetchUsersData();
    }, [id]);
    const convertDate = (dateString) => {
        let date = new Date(dateString);
        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setUser((prevState) => ({
            ...prevState,
            [name]: value
        }))
        if ((value.trim() === "" || value.trim() === null) && name === "fullName") {
            setUser((prevState) => ({
                ...prevState,
                userName: "Full Name can not be blank"
            }))
        } else {
            if (name === "fullName") {
                UserAPI.editUsernameFromFullName(value, id)
                    .then((userName) => {
                        setUser((prevState) => ({
                            ...prevState,
                            userName: userName
                        }))
                    })
                    .catch((error) => {
                        console.error("Error creating userName:", error)
                    })
            }
        }
    }

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
            console.log("dob sau khi bam 1: ", user.dob);
            const formattedDate = format(parseISO(user.dob), "dd/MM/yyyy")
            console.log("dob sau khi bam: ", formattedDate);
            await UserAPI.updateUserDetail(id, { ...user, dob: formattedDate })
            alert("Change has been successfully updated")
            navigate(`/user-management/user-detail/${id}`)
        } catch (error) {
            if (error.response && error.response.data) {
                const { exception } = error.response.data
                const backendErrors = {}

                Object.keys(exception).forEach((key) => {
                    backendErrors[key] = exception[key]
                })

                setBackendErrors(backendErrors)
            } else {
                console.error("Error updating user:", error)
            }
            // setDuplicateError(error.response.data.exception.)
        }
    }

    return (
        <LayoutComponents title={"Edit user"}>
            <Container>
                <div style={{ margin: "60px 100px", width: "70%" }}>
                    <Form onSubmit={handleSubmit}>
                        <Row className="inputItem">
                            <Form.Label
                                style={{
                                    textAlign: "left",
                                    fontWeight: "bold"
                                }}
                                column
                                sm={2}
                            >
                                User Name*
                            </Form.Label>
                            <Col>
                                <Form.Control
                                    className="custom-disabled"
                                    disabled
                                    type="text"
                                    name="userName"
                                    value={user.userName}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row className="inputItem">
                            <Form.Label
                                style={{
                                    textAlign: "left",
                                    fontWeight: "bold"
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
                                    isInvalid={!!errors.fullName || !!backendErrors.fullName}
                                />
                                <Form.Control.Feedback type="invalid" id="error_fullname">
                                    {errors.fullName || backendErrors.fullName}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                        <Row className="inputItem">
                            <Form.Label
                                style={{
                                    textAlign: "left",
                                    fontWeight: "bold"
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
                                    fontWeight: "bold"
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
                                    value={formatDateForInput(user.dob)}
                                    onChange={handleChange}
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
                                    fontWeight: "bold"
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
                                    fontWeight: "bold"
                                }}
                                column
                                sm={2}
                            >
                                Role*
                            </Form.Label>
                            <Col>
                                <Form.Select
                                    name="roleId"
                                    value={user.roleId}
                                    onChange={handleChange}
                                    isInvalid={!!errors.role || !!backendErrors.role}
                                >
                                    <option value="1">Admin</option>
                                    <option value="3">School Owner</option>
                                    <option value="2">Parent</option>
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
                                    fontWeight: "bold"
                                }}
                                column
                                sm={2}
                            >
                                Status
                            </Form.Label>
                            <Col>
                                <Form.Control className="custom-disabled" name="status" value={user.status} disabled></Form.Control>
                            </Col>
                        </Row>
                        <div style={{ textAlign: "right", marginTop: "35px" }}>
                            <Button
                                className="buttonWhite"
                                style={{ marginRight: "40px", width: "130px" }}
                                variant="primary"
                                onClick={() => {
                                    navigate(`/user-management`)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" style={{ width: "130px" }} variant="primary">
                                Save
                            </Button>
                        </div>
                    </Form>
                </div>
            </Container>
        </LayoutComponents>
    )
}

export default EditUserAccountComponent
