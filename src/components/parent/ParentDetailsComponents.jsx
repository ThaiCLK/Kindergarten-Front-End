import { Col, Row, Form, Input, Select, Modal } from "antd"
import LayoutComponents from "../common/LayoutComponents"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TextArea from "antd/es/input/TextArea"
import LoadingComponent from "../common/LoadingComponent"
import ParentApi from "../../api/ParentApi"
import schoolAPI from "../../api/SchoolApi"
import { Rating } from "@mui/material"
import { Button } from "react-bootstrap"

const { Option } = Select

function ParentDetailsComponents() {
    const navigate = useNavigate()
    const [componentSize] = useState("large")
    const { id } = useParams()
    const [loading, setLoading] = useState(true)

    const [parentDetail, setParentDetail] = useState({})
    const [publishedSchoolList, setPublishedSchoolList] = useState([])
    const [enrollSchoolId, setEnrollSchoolId] = useState("")
    const [enrolledSchoolRatingStar, setEnrolledSchoolRatingStar] = useState("")
    const [enrolledSchoolFeedback, setEnrolledSchoolFeedback] = useState("")
    const [enrolledSchoolName, setEnrolledSchoolName] = useState("")

    // State for handling Modal visibility
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [modalAction, setModalAction] = useState("")
    const [form] = Form.useForm();

    useEffect(() => {
        async function fetchRequestDetailData() {
            // Fetch parent details based on ID
            const parentData = await ParentApi.getParentDetailContentWebSystem(id)
            setParentDetail(parentData)

            // If parent is enrolled, get the enrolled school's ID, rating, and feedback
            if (parentData.status === true) {
                const enrolledSchools = parentData.schools
                    .filter((school) => school.status === true)
                    .map((school) => ({
                        schoolName: school.schoolName,
                        schoolId: school.id,
                        averageCriteriaValue: school.feedback?.averageCriteriaValue,
                        content: school.feedback?.content
                    }))

                setEnrolledSchoolRatingStar(enrolledSchools[0].averageCriteriaValue)
                setEnrolledSchoolFeedback(enrolledSchools[0].content)
                setEnrolledSchoolName(enrolledSchools[0].schoolName)
                setEnrollSchoolId(enrolledSchools[0].schoolId)
            }

            // If parent is not enrolled, fetch the list of published schools
            if (parentData.status === false) {
                // Gọi API lấy ra Publihed School
                const listPublishedSchool = await schoolAPI.getListPublishedSchool()
                setPublishedSchoolList(listPublishedSchool)
            }

            setLoading(false)
        }
        fetchRequestDetailData()
    }, [id])

    const showModal = async (action) => {
        if (enrollSchoolId !== '') {
            setModalAction(action);
            setIsModalVisible(true);
        } else {
            try {
                await form.validateFields(['enrolledSchool']);
                setIsModalVisible(false);
            } catch (error) {
                console.error("Validation failed:", error);
            }
        }
    };

    const handleOk = async () => {
        // await form.validateFields();
        // setLoading(true);
        try {
            // Perform the action based on the modalAction state
            if (modalAction === "enroll") {
                await ParentApi.enrollParentToSchool(id, enrollSchoolId);
                navigate("/parent-management", {
                    state: { enrolledParentToSchool: true },
                });
            } else if (modalAction === "unenroll") {
                await ParentApi.unEnrollParentToSchool(id, enrollSchoolId);
                navigate(`/parent-management`)
            }

        } catch (error) {
            alert(error.response.data.detailMessage);
            console.error("Error performing action:", error)
        } finally {
            setLoading(false)
            setIsModalVisible(false)
        }
    }

    const handleCancel = () => {
        // Close the modal without performing any action
        setIsModalVisible(false)
    }

    // Display a loading component while data is being fetched
    if (loading) {
        return <LoadingComponent />
    }

    return (
        <LayoutComponents title={"Parent details"}>
            <Row style={{ marginTop: "50px" }}>
                <Col span={18} offset={3}>
                    <Form
                        requiredMark={false}
                        form={form}
                        labelCol={{ span: 4, fontSize: "40px" }}
                        wrapperCol={{ span: 19 }}
                        layout="horizontal"
                        initialValues={{
                            size: componentSize,
                            fullName: parentDetail.fullName,
                            email: parentDetail.email,
                            dob: parentDetail.dob ? parentDetail.dob.split("T")[0] : "",
                            phone: parentDetail.phone,
                            address: parentDetail.address
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
                        >
                            <Input style={{ height: "50px" }} value={parentDetail.fullName} readOnly />
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
                        >
                            <Input style={{ height: "50px" }} value={parentDetail.email} readOnly />
                        </Form.Item>
                        <Form.Item
                            label={
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700"
                                    }}
                                >
                                    DOB
                                </span>
                            }
                            style={{ marginBottom: "17px" }}
                        >
                            <Input
                                type="date"
                                style={{ height: "50px" }}
                                value={parentDetail.dob ? parentDetail.dob.split("T")[0] : ""}
                                readOnly
                            />
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
                        >
                            <Input style={{ height: "50px" }} value={parentDetail.phone} readOnly />
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
                        >
                            <Input style={{ height: "50px" }} value={parentDetail.address} readOnly />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700"
                                    }}
                                >
                                    Enrolled school
                                </span>
                            }
                            labelAlign="left"
                            style={{ marginBottom: 0 }}
                            name="enrolledSchool"
                            rules={[
                                {
                                    required: true,
                                    message: "Enrolled school is not blank"
                                }
                            ]}
                        >
                            {parentDetail.status === false ? (
                                <Form.Item>
                                    <Select
                                        placeholder="Not enroll yet"
                                        style={{ height: "40px" }}
                                        onChange={(value) => setEnrollSchoolId(value)}
                                    >
                                        {publishedSchoolList.map((school) => (
                                            <Option key={school.id} value={school.id}>
                                                {school.schoolName}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            ) : (
                                <Form.Item>

                                    <Input
                                        style={{ height: "40px" }}
                                        value={enrolledSchoolName || "No school enrolled"}
                                        // disabled
                                        readOnly
                                    />
                                </Form.Item>
                            )}
                        </Form.Item>

                        <Form.Item
                            label={
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700"
                                    }}
                                >
                                    Provided rating
                                </span>
                            }
                            style={{ marginBottom: "17px" }}
                        >
                            {enrolledSchoolRatingStar ? (
                                <Rating name="half-rating-read" defaultValue={enrolledSchoolRatingStar} readOnly />
                            ) : (
                                <span>No rating</span>
                            )}
                        </Form.Item>

                        <Form.Item
                            label={
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "700"
                                    }}
                                >
                                    Feedback
                                </span>
                            }
                        >
                            <TextArea
                                // showCount
                                style={{
                                    height: "100px",
                                    color: "rgba(0, 0, 0, 0.5)"
                                }}
                                value={enrolledSchoolFeedback ? enrolledSchoolFeedback : "No Feedback"}
                                disabled
                            />
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
                                {parentDetail.status === false ? (
                                    <Button onClick={() => showModal("enroll")}>Enroll</Button>
                                ) : (
                                    <Button onClick={() => showModal("unenroll")}>Unenroll</Button>
                                )}
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

            <Modal
                title={modalAction === "enroll" ? "Enroll Parent" : "Unenroll Parent"}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button style={{ marginLeft: "20px" }} key="submit" onClick={handleOk}>
                        Confirm
                    </Button>
                ]}
            >
                <p style={{ marginBottom: "50px" }}>
                    Are you sure you want to {modalAction} this parent to the selected school?
                </p>
            </Modal>
        </LayoutComponents>
    )
}

export default ParentDetailsComponents
