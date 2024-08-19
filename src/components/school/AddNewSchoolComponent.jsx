import React, { useState, useEffect } from "react"
import { Form, Input, Select, InputNumber, Checkbox, Button, Upload, Row, Col, Image } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import CustomQuillEditor from "../common/CustomQuillEditorComponent"
import "../../assets/scss/3-components/_customStylesSchoolDetail.scss"
import { useNavigate } from "react-router-dom"
import LayoutComponents from "../common/LayoutComponents"
import SchoolAPI from "../../api/SchoolApi"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { apiEndpoints } from "../../config"
import { notifyException } from "../../utils/Notify"

const { Group: CheckboxGroup } = Checkbox
const { Option } = Select

function AddNewSchoolComponents() {
    const [form] = Form.useForm()
    const [componentSize] = useState("large")
    const [selectedFacilities, setSelectedFacilities] = useState([])
    const [selectedUtilities, setSelectedUtilities] = useState([])
    const [editorValue, setEditorValue] = useState("")
    const navigate = useNavigate()
    const [imgs, setImgs] = useState([])
    const [imgsToSave, setImgsToSave] = useState([])
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

    const [cities, setCities] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [addressLine, setAddressLine] = useState("")

    const [selectedCity, setSelectedCity] = useState(null)
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedWard, setSelectedWard] = useState(null)

    const hostCity = apiEndpoints.cityApi
    const hostDistricts = `${apiEndpoints.districtsApi}?cityId=`
    const hostWards = `${apiEndpoints.wardsApi}?districtId=`

    const handleUploadChange = ({ fileList }) => {
        const imageUrls = fileList.map((file) => URL.createObjectURL(file.originFileObj))
        setImgs(imageUrls)
        setImgsToSave(fileList)
    }

    const handleChange = (setter) => (checkedValues) => setter(checkedValues)

    const handleSubmit = async () => {
        setIsButtonDisabled(true);
        try {
            const values = await form.validateFields()
            const selectedCityData = cities.find((city) => city.cityId === selectedCity).name
            const selectedWardData = wards.find((ward) => ward.wardId === selectedWard).name
            const selectedDistrictData = districts.find((district) => district.districtId === selectedDistrict).name

            const schoolData = {
                ...values,
                type: parseInt(values.type),
                age: parseInt(values.age),
                method: parseInt(values.method),
                facilities: selectedFacilities,
                utilities: selectedUtilities,
                introduction: editorValue,
                addressLine: addressLine,
                city: selectedCityData ? selectedCityData : "",
                ward: selectedWardData ? selectedWardData : "",
                district: selectedDistrictData ? selectedDistrictData : ""
            }
            await SchoolAPI.createNewSchool(schoolData, imgsToSave)
            toast.success("School created successfully!")
            setTimeout(() => { setIsButtonDisabled(false); navigate("/school-management") }, 1500)
        } catch (error) {
            if (error.response && error.response.status === 413) {
                const err = error.response.data.detail
                notifyException(err, "error")
                setIsButtonDisabled(false);
            } else {
                toast.error("Please fill all the required fields.")
                setIsButtonDisabled(false);
            }
        }
    }

    const handleSaveDraft = async () => {
        setIsButtonDisabled(true);
        try {
            const values = await form.validateFields()
            const selectedCityData = cities.find((city) => city.cityId === selectedCity).name
            const selectedWardData = wards.find((ward) => ward.wardId === selectedWard).name
            const selectedDistrictData = districts.find((district) => district.districtId === selectedDistrict).name

            const schoolData = {
                ...values,
                type: parseInt(values.type),
                age: parseInt(values.age),
                method: parseInt(values.method),
                facilities: selectedFacilities,
                utilities: selectedUtilities,
                introduction: editorValue,
                addressLine: addressLine,
                city: selectedCityData ? selectedCityData : "",
                ward: selectedWardData ? selectedWardData : "",
                district: selectedDistrictData ? selectedDistrictData : ""
            }

            await SchoolAPI.saveDraft(schoolData, imgsToSave)
            toast.success("Save draft successfully!")
            setTimeout(() => { setIsButtonDisabled(false); navigate("/school-management") }, 1500)
        } catch (error) {
            if (error.response && error.response.status === 413) {
                const err = error.response.data.detail
                notifyException(err, "error")
                setIsButtonDisabled(false);
            } else {
                toast.error("Please fill all the required fields.")
                setIsButtonDisabled(false);
            }
        }
    }

    const [options, setOptions] = useState({
        schoolTypes: [],
        facilities: [],
        utilities: [],
        ages: [],
        methods: []
    })

    useEffect(() => {
        const fetchData = async () => {
            const data = await SchoolAPI.fetchAllRequiredData()
            if (data) {
                setOptions({
                    schoolTypes: data.types,
                    facilities: data.facilities,
                    utilities: data.utilities,
                    ages: data.ages,
                    methods: data.methods
                })
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        fetch(hostCity)
            .then((response) => response.json())
            .then((data) => setCities(data))
            .catch((error) => console.error("Error fetching cities:", error))
    }, [])

    useEffect(() => {
        if (selectedCity) {
            fetch(`${hostDistricts}${selectedCity}`)
                .then((response) => response.json())
                .then((data) => setDistricts(data))
                .catch((error) => console.error("Error fetching districts:", error))
        } else {
            setDistricts([])
        }
    }, [selectedCity])

    useEffect(() => {
        if (selectedDistrict) {
            fetch(`${hostWards}${selectedDistrict}`)
                .then((response) => response.json())
                .then((data) => setWards(data))
                .catch((error) => console.error("Error fetching wards:", error))
            setSelectedWard(null)
        } else {
            setWards([])
        }
    }, [selectedDistrict])

    const handleCityChange = (value) => {
        setSelectedCity(value)
        setSelectedDistrict(null)
        setSelectedWard(null)
    }

    const handleAddressChange = (e) => {
        setAddressLine(e.target.value)
    }

    return (
        <LayoutComponents title="Add new school">
            <ToastContainer />
            <Row style={{ marginTop: "50px" }}>
                <Col span={18} offset={3}>
                    <Form
                        form={form}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 15 }}
                        layout="horizontal"
                        initialValues={{ size: componentSize }}
                        size={componentSize}
                        style={{ width: "100%" }}
                    >
                        <Form.Item label={<b>School Name</b>} labelAlign="left" style={{ marginBottom: 0 }}>
                            <Form.Item
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the name"
                                    }
                                ]}
                            >
                                <Input placeholder="Enter School Name Here..." style={{ height: "40px" }} />
                            </Form.Item>
                        </Form.Item>

                        <Form.Item label={<b>School Type</b>} labelAlign="left" style={{ marginBottom: 0 }}>
                            <Form.Item
                                name="type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select type"
                                    }
                                ]}
                            >
                                <Select placeholder="Select a category..." style={{ height: "40px" }}>
                                    {options.schoolTypes.map((schoolType) => (
                                        <Option key={schoolType.id} value={schoolType.id}>
                                            {schoolType.type}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item label={<b>Address</b>}  >
                            <Form.Item name="address"
                                rules={[{ required: true, message: "Please select your address" }]}>
                                <Row>
                                    <Select placeholder="Province/City" onChange={handleCityChange} >
                                        {cities.map((city) => (
                                            <Select.Option key={city.cityId} value={city.cityId}>
                                                {city.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    <Select
                                        placeholder="District"
                                        style={{ marginTop: 8 }}
                                        value={selectedDistrict}
                                        onChange={(value) => setSelectedDistrict(value)}
                                    >
                                        {districts.map((district) => (
                                            <Select.Option key={district.districtId} value={district.districtId}>
                                                {district.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    <Select
                                        placeholder="Ward"
                                        style={{ marginTop: 8 }}
                                        value={selectedWard}
                                        onChange={(value) => setSelectedWard(value)}
                                    >
                                        {wards.map((ward) => (
                                            <Select.Option key={ward.wardId} value={ward.wardId}>
                                                {ward.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    <Input
                                        placeholder="Enter School Address Here..."
                                        style={{ marginTop: 8 }}
                                        value={addressLine}
                                        onChange={handleAddressChange}
                                    />

                                </Row>
                            </Form.Item>
                        </Form.Item>

                        {/* email */}
                        <Form.Item label={<b>Email</b>} labelAlign="left">
                            <Form.Item
                                name="email"
                                style={{ marginBottom: 0 }}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the email"
                                    },
                                    {
                                        pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                        message: "Please enter a valid email address must be email format (example@gmail.com)"
                                    }
                                ]}
                            >
                                <Input placeholder="Enter School Email Here..." style={{ height: "40px" }} />
                            </Form.Item>
                        </Form.Item>

                        {/* phone number */}
                        <Form.Item label={<b>Phone No</b>} labelAlign="left">
                            <Form.Item
                                name="phone"
                                style={{ marginBottom: 0 }}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the phone number"
                                    },
                                    {
                                        pattern: /^0[0-9][0-9]{8}$/,
                                        message: "Please enter a valid 10-digit phone number"
                                    }
                                ]}
                            >
                                <Input placeholder="Enter phone number here..." style={{ height: "40px" }} />
                            </Form.Item>
                        </Form.Item>

                        <Form.Item label={<b>Child-receiving age</b>} labelAlign="left" style={{ marginBottom: 0 }}>
                            <Form.Item
                                name="age"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select age group"
                                    }
                                ]}
                            >
                                <Select placeholder="Select a category..." style={{ height: "40px" }}>
                                    {options.ages.map((age) => (
                                        <Option key={age.id} value={age.id}>
                                            {age.rangeAge}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item label={<b>Education methods</b>} labelAlign="left" style={{ marginBottom: 0 }}>
                            <Form.Item
                                name="method"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select method"
                                    }
                                ]}
                            >
                                <Select placeholder="Select a category..." style={{ height: "40px" }}>
                                    {options.methods.map((method) => (
                                        <Option key={method.id} value={method.id}>
                                            {method.method}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item label={<b>Fee/month (VND)</b>}>
                            <Row>
                                <Col
                                    span={12}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <h5
                                        style={{
                                            whiteSpace: "nowrap",
                                            textAlign: "center",
                                            marginBottom: "30px",
                                            marginRight: "7px",
                                        }}
                                    >
                                        From
                                    </h5>
                                    <Form.Item
                                        style={{ flex: 1 }}
                                        name="feeFrom"
                                        rules={[
                                            { required: true, message: "Please enter From amount" },
                                            {
                                                type: "number",
                                                min: 1000000,
                                                max: 20000000,
                                                message: "From amount must be between 1 million and 20 million",
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            style={{ width: "100%" }}
                                            placeholder="VND"
                                            formatter={(value) =>
                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            }
                                            parser={(value) => value.replace(/\D/g, "")}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col
                                    span={12}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <h5
                                        style={{
                                            whiteSpace: "nowrap",
                                            textAlign: "center",
                                            marginBottom: "28px",
                                            marginRight: "7px",
                                            marginLeft: "7px",
                                        }}
                                    >
                                        To
                                    </h5>
                                    <Form.Item
                                        style={{ flex: 1 }}
                                        name="feeTo"
                                        rules={[
                                            { required: true, message: "Please enter To amount" },
                                            {
                                                type: "number",
                                                min: 1000000,
                                                max: 20000000,
                                                message: "To amount must be between 1 million and 20 million",
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('feeFrom') < value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('To amount must be greater than From amount'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <InputNumber
                                            style={{ width: "100%" }}
                                            placeholder="VND"
                                            formatter={(value) =>
                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            }
                                            parser={(value) => value.replace(/\D/g, "")}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item label={<b>Facilities</b>}>
                            <Form.Item name="facilities">
                                <CheckboxGroup
                                    value={selectedFacilities}
                                    onChange={handleChange(setSelectedFacilities)}
                                    className="custom-checkbox"
                                >
                                    <Row>
                                        {options.facilities.map((facility) => (
                                            <Col span={8} key={facility.id} style={{ marginBottom: "8px" }}>
                                                <Checkbox value={facility.id} style={{ fontSize: "12px" }}>
                                                    {facility.name}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </CheckboxGroup>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item label={<b>Utilities</b>}>
                            <Form.Item name="utilities">
                                <CheckboxGroup
                                    value={selectedUtilities}
                                    onChange={handleChange(setSelectedUtilities)}
                                    className="custom-checkbox"
                                >
                                    <Row>
                                        {options.utilities.map((utility) => (
                                            <Col span={8} key={utility.id} style={{ marginBottom: "8px" }}>
                                                <Checkbox value={utility.id} style={{ fontSize: "12px" }}>
                                                    {utility.name}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </CheckboxGroup>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item label={<b>School Introduction</b>} labelAlign="left" wrapperCol={{ span: 19 }}>
                            <CustomQuillEditor value={editorValue} onChange={setEditorValue} disabled={false} />
                        </Form.Item>

                        <Form.Item label="School Image" wrapperCol={{ span: 19 }}>
                            <Upload
                                style={{
                                    width: "100%",
                                    height: "100px",
                                    border: "2px dashed #ccc"
                                }}
                                listType="picture"
                                onChange={handleUploadChange}
                                beforeUpload={() => false} // Prevent automatic upload
                                multiple // Allow multiple file uploads
                            >
                                <Button icon={<UploadOutlined />}>Upload files or drag and drop</Button>
                            </Upload>

                            <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
                                {imgs.length > 0 ? (
                                    imgs.map((img, index) => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                            <Image
                                                src={img}
                                                style={{
                                                    width: "100%",
                                                    height: "200px",
                                                    objectFit: "cover",
                                                    borderRadius: "15px"
                                                }}
                                            />
                                        </Col>
                                    ))
                                ) : (
                                    <Col xs={24}>{/* <Image src="holder.js/171x180" rounded /> */}</Col>
                                )}
                            </Row>
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 23 }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end"
                                }}
                            >
                                <button
                                    type="button"
                                    style={{ marginRight: 14, width: "100px" }}
                                    onClick={() => navigate("/school-management")}
                                    className="btn btn-outline-primary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    style={{ marginRight: 14, width: "100px" }}
                                    className="btn btn-primary"
                                    onClick={handleSaveDraft}
                                    disabled={isButtonDisabled}
                                >
                                    Save Draft
                                </button>
                                <button
                                    type="button"
                                    style={{ width: "100px" }}
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                    disabled={isButtonDisabled}
                                >
                                    Submit
                                </button>
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </LayoutComponents >
    )
}

export default AddNewSchoolComponents
