import { useEffect, useState } from "react"
import LayoutComponents from "../common/LayoutComponents"
import { Col, Form, Input, Row } from "antd"
import RenderButtonComponent from "../common/RenderButtonComponent"
import TextArea from "antd/es/input/TextArea"
import { useParams } from "react-router-dom"
import RequestApi from "../../api/RequestApi"
import storage from "../../utils/storage"
import LoadingComponent from "../common/LoadingComponent"

function RequestDetailsComponents() {
    const [componentSize] = useState("large")
    const { id } = useParams()
    const [loading, setLoading] = useState(true)

    const [role, setRole] = useState("")
    const [status, setStatus] = useState("")
    const [requestDetail, setRequestDetail] = useState({})

    useEffect(() => {
        async function fetchRequestDetailData() {
            const requestData = await RequestApi.getRequestDetail(id)

            setRequestDetail(requestData)
            setStatus(requestData.status)
            setLoading(false)

            const user = storage.getUserInfo()
            setRole(user.role)
        }
        fetchRequestDetailData()
    }, [id])

    if (loading) {
        return (
            <div>
                <LoadingComponent />
            </div>
        )
    }

    return (
        <LayoutComponents title={"Request details"} status={status}>
            <Row style={{ marginTop: "50px" }}>
                <Col span={18} offset={3}>
                    <Form
                        labelCol={{ span: 4, fontSize: "40px" }}
                        wrapperCol={{ span: 19 }}
                        layout="horizontal"
                        initialValues={{
                            size: componentSize,
                            fullName: requestDetail.fullName,
                            email: requestDetail.email,
                            phone: requestDetail.phone,
                            address: requestDetail.address,
                            schoolName: requestDetail.schoolName,
                            question: requestDetail.question
                        }}
                        size={componentSize}
                        style={{ width: "100%" }}
                    >
                        <Form.Item
                            label={
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700"
                                    }}
                                >
                                    Full Name
                                </span>
                            }
                            style={{ marginBottom: "17px" }}
                            name="fullName"
                        >
                            <Input style={{ height: "50px", marginLeft:'30px' }} disabled />
                        </Form.Item>
                        <Form.Item
                            label={
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700"
                                    }}
                                >
                                    Email
                                </span>
                            }
                            style={{ marginBottom: "17px" }}
                            name="email"
                        >
                            <Input style={{ height: "50px", marginLeft:'30px' }} disabled />
                        </Form.Item>
                        <Form.Item
                            label={
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700"
                                    }}
                                >
                                    Phone No
                                </span>
                            }
                            style={{ marginBottom: "17px" }}
                            name="phone"
                        >
                            <Input style={{ height: "50px", marginLeft:'30px' }} disabled />
                        </Form.Item>
                        <Form.Item
                            label={
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700"
                                    }}
                                >
                                    Address
                                </span>
                            }
                            style={{ marginBottom: "17px" }}
                            name="address"
                        >
                            <Input style={{ height: "50px", marginLeft:'30px' }} disabled />
                        </Form.Item>
                        <Form.Item
                            label={
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700"
                                    }}
                                >
                                    Requested school
                                </span>
                            }
                            style={{ marginBottom: "17px" }}
                            name="schoolName"
                        >
                            <Input style={{ height: "50px", marginLeft:'30px' }} disabled />
                        </Form.Item>
                        <Form.Item
                            label={
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700"
                                    }}
                                >
                                    Inquiries
                                </span>
                            }
                            name="question"
                        >
                            <TextArea style={{ marginLeft:'30px' }} disabled />
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{ span: 23 }}
                            style={{
                                marginTop: "100px",
                                marginBottom: "140px"
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end"
                                }}
                            >
                                <RenderButtonComponent userRole={role} status={status} id={id} />
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </LayoutComponents>
    )
}

export default RequestDetailsComponents
