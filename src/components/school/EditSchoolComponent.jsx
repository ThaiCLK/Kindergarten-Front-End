import React, { useState, useEffect } from "react"
import { Form, Input, Select, InputNumber, Checkbox, Button, Upload, Row, Col, Image } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import CustomQuillEditor from "../common/CustomQuillEditorComponent"
import { useNavigate, useParams } from "react-router-dom"
import LayoutComponents from "../common/LayoutComponents"
import SchoolAPI from "../../api/SchoolApi"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { apiEndpoints } from "../../config"

const { Option } = Select
const { Group: CheckboxGroup } = Checkbox

function EditSchoolComponent() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [form] = Form.useForm()
    const [schoolData, setSchoolData] = useState({})
    const [schoolStatus, setSchoolStatus] = useState("")

    const [facilities, setFacilities] = useState([])
    const [utilities, setUtilities] = useState([])
    const [selectedFacilities, setSelectedFacilities] = useState([])
    const [selectedUtilities, setSelectedUtilities] = useState([])
    const [editorValue, setEditorValue] = useState("")
    const [options, setOptions] = useState({
        schoolTypes: [],
        facilities: [],
        utilities: [],
        ages: [],
        methods: []
    })

    const [cities, setCities] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [selectedCity, setSelectedCity] = useState(null)
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedWard, setSelectedWard] = useState(null)
    const hostCity = apiEndpoints.cityApi
    const hostDistricts = `${apiEndpoints.districtsApi}?cityId=`
    const hostWards = `${apiEndpoints.wardsApi}?districtId=`

    const [imagesList, setImagesList] = useState([])
    const [imgsToSave, setImgsToSave] = useState([])
    const [errorFrom, setErrorFrom] = useState("")
    const [errorTo, setErrorTo] = useState("")
    const [errorDistrict, setErrorDistrict] = useState("")
    const [errorWard, setErrorWard] = useState("")
    const handleChangeFrom = (value) => {
        if (value < 1000000 || value > 20000000) {
            setErrorFrom("Fee must be between 1,000,000 and 20,000,000")
        } else {
            if (value && value > form.getFieldValue('feeTo')) {
                setErrorFrom("Fee From cannot be greater than Fee To");
            } else {
                setErrorFrom("");
            }
        }

        form.setFieldsValue({ feeFrom: value });
    }

    const handleChangeTo = (value) => {
        if (value < 1000000 || value > 20000000) {
            setErrorTo("Fee must be between 1,000,000 and 20,000,000")
        } else {
            if (value && value < form.getFieldValue('feeFrom')) {
                setErrorTo("Fee To cannot be less than minimum Fee From");
            } else {
                setErrorTo("");
            }
        }

        form.setFieldsValue({ feeTo: value });
    }
    useEffect(() => {
        fetch(hostCity)
            .then((response) => response.json())
            .then((data) => setCities(data))
            .catch((error) => console.error("Error fetching cities:", error))
    }, [])

    useEffect(() => {
        if(selectedDistrict){
            setErrorDistrict("")
        }
        if(selectedWard){
            setErrorWard("")
        }
    }, [selectedDistrict, selectedWard])

    const handleCityChange = (value) => {
        setSelectedCity(value);
        setSelectedDistrict(null); // Reset district
        setSelectedWard(null); // Reset ward
    };
    const handleDistrictChange = (value) => {
        setSelectedDistrict(value);
        setSelectedWard(null); // Reset ward
    };

    useEffect(() => {
        const fetchSchoolDetail = async () => {
            const [facilitiesData, utilitiesData, schoolDetail] = await Promise.all([
                SchoolAPI.getSchoolFacilities(),
                SchoolAPI.getSchoolUtilities(),
                SchoolAPI.fetchSchoolDetail(id)
            ])

            setSelectedCity(schoolDetail.city)
            setSelectedDistrict(schoolDetail.district)
            setSelectedWard(schoolDetail.ward)

            if (schoolDetail.images) {
                const oldImagesList = schoolDetail.images.map((img, index) => ({
                    id: img.id,
                    uid: `-${index}`,
                    name: `image-${index}.jpg`,
                    status: "OLD_IMAGES",
                    url: img.imagePath,
                    id: img.id
                }))
                setImgsToSave(oldImagesList)
                setImagesList(oldImagesList)
            }

            setFacilities(facilitiesData)
            setUtilities(utilitiesData)

            const facilityIds = schoolDetail.facilities.map((facility) => facility.id)
            const utilityIds = schoolDetail.utilities.map((utility) => utility.id)

            setSelectedFacilities(facilityIds)
            setSelectedUtilities(utilityIds)

            setSchoolStatus(schoolDetail.status.id)
            setSchoolData(schoolDetail)
            setEditorValue(schoolDetail.introduction)

            form.setFieldsValue({
                schoolName: schoolDetail.name,
                type: schoolDetail.type.id,
                addressLine: schoolDetail.addressLine,
                ward: schoolDetail.ward,
                district: schoolDetail.district,
                city: schoolDetail.city,
                email: schoolDetail.email,
                phone: schoolDetail.phone,
                age: schoolDetail.age.id,
                method: schoolDetail.method.id,
                feeFrom: schoolDetail.feeFrom,
                feeTo: schoolDetail.feeTo,
                facilities: facilityIds,
                utilities: utilityIds
            })
        }
        fetchSchoolDetail()
    }, [id])

    useEffect(() => {
        if (selectedCity && (isNaN(Number(selectedCity)))) {
            const selectedCityData = cities.find(city => city.name === selectedCity);
            const cityId = selectedCityData ? selectedCityData.cityId : null;
            fetch(`${hostDistricts}${cityId}`)
                .then((response) => response.json())
                .then((data) => setDistricts(data))
                .catch((error) => console.error("Error fetching districts:", error))
        } else {
            if (selectedCity && !isNaN(Number(selectedCity))) {
                fetch(`${hostDistricts}${selectedCity}`)
                    .then((response) => response.json())
                    .then((data) => setDistricts(data))
                    .catch((error) => console.error("Error fetching districts:", error))
            } else {
                setDistricts([])
            }

        }
    }, [cities])

    useEffect(() => {
        if (selectedDistrict && (isNaN(Number(selectedDistrict)))) {

            const selectedDistrictData = districts.find(d => d.name === selectedDistrict);
            const districtId = selectedDistrictData ? selectedDistrictData.districtId : null;
            fetch(`${hostWards}${districtId}`)
                .then((response) => response.json())
                .then((data) => setWards(data))
                .catch((error) => console.error("Error fetching wards:", error))
        } else {
            if (selectedDistrict && !isNaN(Number(selectedDistrict))) {
                fetch(`${hostWards}${selectedDistrict}`)
                    .then((response) => response.json())
                    .then((data) => setWards(data))
                    .catch((error) => console.error("Error fetching wards:", error))
            } else {
                setWards([])
            }


        }
    }, [districts])

    const handleUploadChange = ({ fileList }) => {
        const newImages = fileList.map((file, index) => ({
            id: file.status === "OLD_IMAGES" ? file.id : `+${index}`,
            uid: file.uid,
            name: file.name,
            status: file.status === "OLD_IMAGES" ? "OLD_IMAGES" : "NEW_IMAGES",
            url: file.originFileObj ? URL.createObjectURL(file.originFileObj) : file.url,
            originFileObj: file.originFileObj
        }))

        setImagesList(newImages)
        setImgsToSave(newImages)
    }

    const handleRemove = (file) => {
        const newFileList = imagesList.filter((item) => item.uid !== file.uid)
        setImagesList(newFileList)
    }

    const handleChange = (setter) => (checkedValues) => setter(checkedValues)
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
    
            const getSelectedData = (selected, dataList, key) => {
                if (!isNaN(Number(selected))) {
                    return dataList.find((item) => item[key] === selected);
                } else {
                    return dataList.find((item) => item.name === selected);
                }
            };
    
            const selectedCityData = getSelectedData(selectedCity, cities, 'cityId');
            const selectedWardData = getSelectedData(selectedWard, wards, 'wardId');
            const selectedDistrictData = getSelectedData(selectedDistrict, districts, 'districtId');
            
            const schoolData1 = {
                ...values,
                type: parseInt(values.type),
                age: parseInt(values.age),
                method: parseInt(values.method),
                feeFrom: parseFloat(values.feeFrom),
                feeTo: parseFloat(values.feeTo),
                facilities: selectedFacilities,
                utilities: selectedUtilities,
                introduction: editorValue,
                name: values.schoolName,
                city: selectedCityData ? selectedCityData.name : null,
                ward: selectedWardData ? selectedWardData.name : null,
                district: selectedDistrictData ? selectedDistrictData.name : null
            };
    
            await SchoolAPI.editSchool(schoolData1, id, imgsToSave);
            toast.success("School edited successfully!");
            setTimeout(() => navigate("/school-management"), 1500);
        } catch (error) {
            console.error("Failed to submit:", error);
    
            if (error.response.data.exception.district) {
                setErrorDistrict("Please select the district");
            }
            if (error.response.data.exception.ward) {
                setErrorWard("Please select the ward");
            }
    
            toast.error("Please fill all the required fields.");
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
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
            } catch (error) {
                console.error("Error fetching required data:", error)
            }
        }

        fetchData()
    }, [])
    const numberFormatter = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const numberParser = (value) => {
        return value.replace(/\$\s?|(,*)/g, '');
    };
    return (
        <LayoutComponents title="Edit School" status={schoolStatus}>
            <ToastContainer />
            <Row style={{ marginTop: "50px" }}>
                <Col span={18} offset={3}>
                    <Form
                        form={form}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 16 }}
                        layout="horizontal"
                        size="large"
                        requiredMark={false}
                    >
                        <Form.Item
                            label={<b>School Name</b>}
                            labelAlign="left"
                            name="schoolName"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter the name"
                                }
                            ]}
                        >
                            <Input placeholder="Enter School Name Here..." />
                        </Form.Item>

                        <Form.Item
                            label={<b>School Type</b>}
                            labelAlign="left"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select type"
                                }
                            ]}
                        >
                            <Select
                                onChange={(value) => {
                                    form.setFieldsValue({ type: value })
                                }}
                                placeholder="Select School Type..."
                            >
                                {options.schoolTypes.map((schoolType) => (
                                    <Option key={schoolType.id} value={schoolType.id}>
                                        {schoolType.type}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={<b>Address</b>} labelAlign="left">
                            <Select
                                value={selectedCity}
                                onChange={handleCityChange}
                                placeholder="Select City"
                            >
                                {cities.map((city) => (
                                    <Select.Option key={city.cityId} value={city.cityId}>
                                        {city.name}
                                    </Select.Option>
                                ))}
                            </Select>

                            <Select
                                style={{ marginTop: 8 }}
                                value={selectedDistrict}
                                onChange={handleDistrictChange}
                                placeholder="Select District"
                                disabled={!selectedCity}
                            >
                                {districts.map((district) => (
                                    <Select.Option key={district.districtId} value={district.districtId}>
                                        {district.name}
                                    </Select.Option>
                                ))}
                            </Select>
                            {errorDistrict && <p style={{ color: 'red' }}>{errorDistrict}</p>}


                            <Select
                                style={{ marginTop: 8 }}
                                value={selectedWard}
                                onChange={(value) => setSelectedWard(value)}
                                placeholder="Select Ward"
                                disabled={!selectedDistrict}
                            >
                                {wards.map((ward) => (
                                    <Select.Option key={ward.wardId} value={ward.wardId}>
                                        {ward.name}
                                    </Select.Option>
                                ))}
                            </Select>
                            {errorWard && <p style={{ color: 'red' }}>{errorWard}</p>}

                            <Form.Item
                                name="addressLine"
                                style={{ marginTop: 8 }}
                            >
                                <Input placeholder="Enter School Address Here..." />
                            </Form.Item>
                        </Form.Item>


                        <Form.Item
                            label={<b>Email</b>}
                            labelAlign="left"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter the email"
                                },
                                {
                                    pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                    message: "Please enter a valid email address in the format user@gmail.com"
                                }
                            ]}
                        >
                            <Input placeholder="Enter School Email Here..." />
                        </Form.Item>

                        <Form.Item
                            label={<b>Phone No</b>}
                            labelAlign="left"
                            name="phone"
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
                            <Input placeholder="Enter School Phone Number Here..." />
                        </Form.Item>

                        <Form.Item
                            label={<b>School Age</b>}
                            labelAlign="left"
                            name="age"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select the school age"
                                }
                            ]}
                        >
                            <Select
                                onChange={(value) => {
                                    form.setFieldsValue({ age: value })
                                }}
                                placeholder="Select School Age..."
                            >
                                {options.ages.map((age) => (
                                    <Option key={age.id} value={age.id}>
                                        {age.rangeAge}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={<b>Education Method</b>}
                            labelAlign="left"
                            name="method"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select the education method"
                                }
                            ]}
                        >
                            <Select
                                onChange={(value) => {
                                    form.setFieldsValue({ method: value })
                                }}
                                placeholder="Select Education Method..."
                            >
                                {options.methods.map((method) => (
                                    <Option key={method.id} value={method.id}>
                                        {method.method}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label={<b>Fee/month(VND)</b>} labelAlign="left">
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item
                                        label={<b>From</b>}
                                        name="feeFrom"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter the minimum fee"
                                            }
                                        ]}
                                        validateStatus={errorFrom ? "error" : ""}
                                        help={errorFrom}
                                    >
                                        <InputNumber
                                            placeholder="Enter Minimum Fee"
                                            style={{ width: "100%" }}
                                            onChange={handleChangeFrom}
                                            formatter={numberFormatter}
                                            parser={numberParser}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={<b>To</b>}
                                        name="feeTo"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter the maximum fee"
                                            }
                                        ]}
                                        validateStatus={errorTo ? "error" : ""}
                                        help={errorTo}
                                    >
                                        <InputNumber
                                            placeholder="Enter Maximum Fee"
                                            style={{ width: "100%" }}
                                            onChange={handleChangeTo}
                                            formatter={numberFormatter}
                                            parser={numberParser}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item label={<b>Facility</b>} labelAlign="left">
                            <CheckboxGroup
                                className="custom-checkbox"
                                // options={facilities.map((facility) => ({
                                //     label: facility.name,
                                //     value: facility.id
                                // }))}
                                value={selectedFacilities}
                                onChange={handleChange(setSelectedFacilities)}
                                // style={{ width: "900px" }}
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

                        <Form.Item label={<b>Utility</b>} labelAlign="left">
                            <CheckboxGroup
                                className="custom-checkbox"
                                // options={utilities.map((utility) => ({
                                //     label: utility.name,
                                //     value: utility.id
                                // }))}
                                value={selectedUtilities}
                                onChange={handleChange(setSelectedUtilities)}
                                // style={{ width: "900px" }}
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

                        <Form.Item label={<b>Introduction</b>} labelAlign="left" wrapperCol={{ span: 19 }}>
                            <CustomQuillEditor disabled value={editorValue} onChange={(content) => setEditorValue(content)} />
                        </Form.Item>

                        <Form.Item label="School Image" wrapperCol={{ span: 19 }}>
                            <Upload
                                style={{
                                    width: "100%",
                                    height: "100px",
                                    border: "2px dashed #ccc"
                                }}
                                fileList={imagesList}
                                listType="picture"
                                onRemove={handleRemove}
                                onChange={handleUploadChange}
                                beforeUpload={() => false} // Prevent automatic upload
                                multiple // Allow multiple file uploads
                            >
                                <Button icon={<UploadOutlined />}>Upload files or drag and drop</Button>
                            </Upload>

                            <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
                                {imagesList?.length > 0 ? (
                                    imagesList.map((img, index) => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                            <Image
                                                src={img.url}
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
                                    <Col xs={24}>{/* Placeholder for no images */}</Col>
                                )}
                            </Row>
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 23 }}>
                            <Row justify="end">
                                <Col>
                                    <Button
                                        type="warning"
                                        style={{
                                            marginLeft: "20px",
                                            width: "120px",
                                            color: "#3167F3",
                                            border: "1px solid",
                                        }}
                                        onClick={() => navigate("/school-management")}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                                <Col>
                                    {schoolStatus === "REJECTED" ||
                                        schoolStatus === "SUBMITTED" ||
                                        schoolStatus === "DELETED" ||
                                        errorFrom != ""
                                        || errorTo != "" ? (
                                        <Button
                                            type="primary"
                                            style={{ marginLeft: "20px", width: "120px" }}
                                            onClick={handleSubmit}
                                            disabled
                                        >
                                            Submit
                                        </Button>
                                    ) : (
                                        <Button
                                            type="primary"
                                            style={{ marginLeft: "20px", width: "120px" }}
                                            onClick={handleSubmit}
                                        >
                                            Submit
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </LayoutComponents>
    );
}

export default EditSchoolComponent
