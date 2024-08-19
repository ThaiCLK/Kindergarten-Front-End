import React, { useEffect, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import UserAPI from "../../api/UserApi"
import LayoutComponents from "../common/LayoutComponents"
import { getRoleName, formatDateForInput } from "../../utils/fomatUtils"
import LoadingComponent from "../common/LoadingComponent"
import "../../assets/scss/_userDetailComponent.scss"
function ViewUserDetailsComponent() {
    const [user, setUser] = useState({})
    const [Stt, setStt] = useState("Active")
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUsersData() {
            const usersData = await UserAPI.getUserDetail(id)
            setUser(usersData)
            setLoading(false)
        }

        fetchUsersData()
    }, [user.status])

    const handleStatus = async () => {
        const newStatus = user.status === "Active" ? "Inactive" : "Active"
        const updatedUser = await UserAPI.updateStatus(user, newStatus)
        setUser(updatedUser)
        setStt(newStatus)
    }

    if (loading) {
        return (
            <div>
                <LoadingComponent />
            </div>
        )
    }

    return (
        <LayoutComponents title={"View User Detail"}>
            <Container>
                <div style={{ margin: "60px 100px" }}>
                    <Row className="inputItem">
                        <Form.Label style={{ textAlign: "left", fontWeight: "bold", alignContent:'center' }} column sm={2}>
                            User Name*
                        </Form.Label>
                        <Col style={{alignContent:'center'}}>
                            <p style={{marginBottom:'0px' }}>{user.userName}</p>
                        </Col>
                    </Row>
                    <Row className="inputItem">
                        <Form.Label style={{ textAlign: "left", fontWeight: "bold", alignContent:'center'  }} column sm={2}>
                            Full Name*
                        </Form.Label>
                        <Col style={{alignContent:'center'}}>
                            <p style={{marginBottom:'0px' }}>{user.fullName}</p>
                        </Col>
                    </Row>
                    <Row className="inputItem">
                        <Form.Label style={{ textAlign: "left", fontWeight: "bold", alignContent:'center'  }} column sm={2}>
                            Email*
                        </Form.Label>
                        <Col style={{alignContent:'center'}}>
                            <p style={{marginBottom:'0px' }}>{user.email}</p>
                        </Col>
                    </Row>
                    <Row className="inputItem">
                        <Form.Label style={{ textAlign: "left", fontWeight: "bold", alignContent:'center'  }} column sm={2}>
                            DOB*
                        </Form.Label>
                        <Col style={{alignContent:'center'}}>
                            <p style={{marginBottom:'0px' }}>{formatDateForInput(user.dob)}</p>
                        </Col>
                    </Row>
                    <Row className="inputItem">
                        <Form.Label style={{ textAlign: "left", fontWeight: "bold", alignContent:'center'  }} column sm={2}>
                            Phone No*
                        </Form.Label>
                        <Col style={{alignContent:'center'}}>
                            <p style={{marginBottom:'0px' }}>{user.phone}</p>
                        </Col>
                    </Row>
                    <Row className="inputItem">
                        <Form.Label style={{ textAlign: "left", fontWeight: "bold", alignContent:'center'  }} column sm={2}>
                            Role*
                        </Form.Label>
                        <Col style={{alignContent:'center'}}>
                            <p style={{marginBottom:'0px' }}>{getRoleName(user.roleId)}</p>
                        </Col>
                    </Row>
                    <Row className="inputItem">
                        <Form.Label style={{ textAlign: "left", fontWeight: "bold", alignContent:'center'  }} column sm={2}>
                            Status
                        </Form.Label>
                        <Col style={{alignContent:'center'}}>
                            <p style={{marginBottom:'0px' }}>{user.status}</p>
                        </Col>
                    </Row>
                    <div style={{ textAlign: "right", marginTop: "35px" }}>
                        {user.status === "Active" ? (
                            <Button
                                className="buttonWhite"
                                style={{ marginRight: "40px", width: "130px" }}

                                onClick={handleStatus}
                            >
                                Deactivate
                            </Button>
                        ) : (
                            <Button
                                className="buttonWhite"
                                style={{ marginRight: "40px", width: "130px" }}

                                onClick={handleStatus}
                            >
                                Activate
                            </Button>
                        )}

                        <Button
                            className="buttonWhite"
                            style={{ marginRight: "40px", width: "130px" }}

                            onClick={() => navigate("/user-management/user-list")}
                        >
                            Cancel
                        </Button>
                        <Button
                            style={{ width: "130px", marginRight: "200px" }}
                            variant="primary"
                            onClick={() => navigate(`/user-management/user-detail/edit-user/${id}`)}
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            </Container>
        </LayoutComponents>
    )
}

export default ViewUserDetailsComponent
