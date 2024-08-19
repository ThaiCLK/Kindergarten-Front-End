import React, { useEffect, useState } from "react"
import { Form, Input, Select, InputNumber, Checkbox, Row, Col, Space, Image } from "antd"
import CustomQuillEditor from "../common/CustomQuillEditorComponent"
import "../../assets/scss/3-components/_customStylesSchoolDetail.scss"
import { Link, useParams } from "react-router-dom"
import SchoolApi from "../../api/SchoolApi"
import LayoutComponents from "../common/LayoutComponents"
import storage from "../../utils/storage"
import RenderButtonComponent from "../common/RenderButtonComponent"
import LoadingComponent from "../common/LoadingComponent"

function SchoolDetailsComponents() {
    const [componentSize] = useState("large")
    const [editorValue, setEditorValue] = useState("")
    const [facilities, setFacilities] = useState([])
    const [utilities, setUtilities] = useState([])
    const [selectedFacilities, setSelectedFacilities] = useState([])
    const [selectedUtilities, setSelectedUtilities] = useState([])
    const [schoolData, setSchoolData] = useState({})
    const [role, setRole] = useState("")

    const { id } = useParams()
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSchoolDetail = async () => {
            const [facilitiesData, utilitiesData, schoolDetail] = await Promise.all([
                SchoolApi.getSchoolFacilities(),
                SchoolApi.getSchoolUtilities(),
                SchoolApi.fetchSchoolDetail(id)
            ])

            setFacilities(facilitiesData)
            setUtilities(utilitiesData)

            const facilityIds = schoolDetail.facilities.map((facility) => facility.id)
            const utilityIds = schoolDetail.utilities.map((utility) => utility.id)

            setSelectedFacilities(facilityIds)
            setSelectedUtilities(utilityIds)
            setSchoolData(schoolDetail)
            setStatus(schoolDetail.status.id)
            setLoading(false)

            const user = storage.getUserInfo()
            setRole(user.role)
        }

        fetchSchoolDetail()
    }, [id])

    if (loading) {
        return (
            <div>
                <LoadingComponent />
            </div>
        )
    }

    return (
        <div>

        <Link style={{marginLeft:'80%', marginTop:"-20px"}} to={`/school-management/rating-feedback/${id}`}>View ratings & feedbacks</Link>
        <LayoutComponents title={"School details"} status={status}>
            <Row style={{ marginTop: "50px" }}>
                <Col span={18} offset={3}>
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 15 }}
                        layout="horizontal"
                        initialValues={{ size: componentSize }}
                        size={componentSize}
                        style={{ width: "100%" }}
                    >
                        <Form.Item label="School Name">
                            <Input value={schoolData.name} disabled />
                        </Form.Item>
                        <Form.Item label="School Type">
                            <Select value={schoolData.type?.type} disabled placeholder="Select a category...">
                                <Select.Option value="category1">Category 1</Select.Option>
                                <Select.Option value="category2">Category 2</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Address">
                            <Input value={schoolData.city} disabled style={{ marginTop: 4 }} />
                            <Input value={schoolData.district} disabled style={{ marginTop: 4 }} />
                            <Input value={schoolData.ward} disabled style={{ marginTop: 4 }} />
                            <Input value={schoolData.addressLine} disabled style={{ marginTop: 4 }} />
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input value={schoolData.email} disabled />
                        </Form.Item>
                        <Form.Item label="Phone No">
                            <Input value={schoolData.phone} disabled />
                        </Form.Item>
                        <Form.Item label="Child-receiving age">
                            <Select value={schoolData.age?.rangeAge} disabled>
                                <Select.Option value="age1">Age 1</Select.Option>
                                <Select.Option value="age2">Age 2</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Education method">
                            <Select value={schoolData.method?.method} disabled>
                                <Select.Option value="method1">Method 1</Select.Option>
                                <Select.Option value="method2">Method 2</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Fee/month (VND)">
                            <Space.Compact>
                                <Row>
                                    <Col
                                        span={12}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <h5
                                            style={{
                                                whiteSpace: "nowrap",
                                                textAlign: "center",
                                                margin: "0 8px"
                                            }}
                                        >
                                            From
                                        </h5>
                                        <InputNumber
                                            style={{ flex: 1 }}
                                            placeholder="From"
                                            formatter={(value) => `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            parser={(value) => value.replace(/\D/g, "")}
                                            value={schoolData.feeFrom}
                                            disabled
                                        />
                                    </Col>
                                    <Col
                                        span={12}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <h5
                                            style={{
                                                whiteSpace: "nowrap",
                                                textAlign: "center",
                                                margin: "0 8px"
                                            }}
                                        >
                                            To
                                        </h5>
                                        <InputNumber
                                            style={{ flex: 1 }}
                                            placeholder="To"
                                            formatter={(value) => `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            parser={(value) => value.replace(/\D/g, "")}
                                            value={schoolData.feeTo}
                                            disabled
                                        />
                                    </Col>
                                </Row>
                            </Space.Compact>
                        </Form.Item>

                        <Form.Item label="Facilities">
                            <Checkbox.Group value={selectedFacilities} disabled>
                                <Row gutter={[16, 16]}>
                                    {facilities.map((option) => (
                                        <Col span={8} key={option.id} className="custom-checkbox">
                                            <Checkbox value={option.id} className="custom-checkbox-disabled">
                                                {option.name}
                                            </Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item label="Utilities">
                            <Checkbox.Group value={selectedUtilities} disabled>
                                <Row gutter={[16, 16]}>
                                    {utilities.map((option) => (
                                        <Col span={8} key={option.id} className="custom-checkbox">
                                            <Checkbox value={option.id} className="custom-checkbox-disabled">
                                                {option.name}
                                            </Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item label="School Introduction" wrapperCol={{ span: 19 }}>
                            <CustomQuillEditor
                                value={schoolData.introduction}
                                onChange={setEditorValue}
                                isDisabled={true}
                            />
                        </Form.Item>
                        <Form.Item label="School Image" wrapperCol={{ span: 19 }}>
                            <Row gutter={[16, 16]}>
                                {schoolData.images.map((image, index) => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                        <Image
                                            src={image.imagePath}
                                            style={{
                                                width: "100%",
                                                height: "200px",
                                                objectFit: "cover",
                                                borderRadius: "15px"
                                            }}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 23 }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end"
                                }}
                            >
                                <RenderButtonComponent userRole={role} status={status} id={schoolData.id} />
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </LayoutComponents>
        </div>

    )
}

export default SchoolDetailsComponents
