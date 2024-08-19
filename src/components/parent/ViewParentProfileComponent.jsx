import React, { useState, useEffect } from "react";
import { DatePicker, Input, Select, Button, Col, Row, Form, Upload, Image } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import "../../assets/scss/3-components/_viewParentProfileComponent.scss";
import { apiEndpoints } from "../../config";
import ParentApi from "../../api/ParentApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import storage from "../../utils/storage";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import moment from "moment";
import { Container } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/reducers/UserInfoSlice';
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import Breadcrumbs from "../common/Breadcrumbs"

const { Item: FormItem } = Form;

const ViewParentProfileComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = storage.getUserInfo();
  const id = userInfo?.id;
  const [activeTab, setActiveTab] = useState("myInformation");
  const [imgs, setImgs] = useState([]);
  const [imgsToSave, setImgsToSave] = useState([]);
  const [form] = Form.useForm();
  const [initialCities, setInitialCities] = useState([]);
  const [initialDistricts, setInitialDistricts] = useState([]);
  const [initialWards, setInitialWards] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [addressLine, setAddressLine] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [backendErrors, setBackendErrors] = useState({});
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    dob: "",
    phone: "",
    avatar: "",
    addressLine: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
    setBackendErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleUploadChange = ({ fileList }) => {
    const imageUrls = fileList.map((file) =>
      URL.createObjectURL(file.originFileObj)
    );
    setImgs(imageUrls);
    setImgsToSave(fileList);
    setImgs(fileList.map(file => URL.createObjectURL(file.originFileObj)));
  };

  const handleDateChange = (date) => {
    const selectedDate = date ? date.startOf('day') : null;

    setProfile((prevProfile) => ({
      ...prevProfile,
      dob: selectedDate ? selectedDate.toISOString() : '',
    }));

    setBackendErrors((prevErrors) => ({
      ...prevErrors,
      dob: "",
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));

    setBackendErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
      message: "",
    }));

    if (name === 'newPassword' || name === 'confirmPassword') {
      setConfirmPasswordError(
        passwords.newPassword !== value ? 'Passwords do not match' : '',
        passwords.confirmPassword === "" ? 'This field is required' : ''
      );
    }
  };

  const handleAddressChange = (event) => {
    const newAddressLine = event.target.value;
    setAddressLine(newAddressLine);
    setProfile(prevProfile => ({
      ...prevProfile,
      addressLine: newAddressLine,
    }));
  };

  const hostCity = apiEndpoints.cityApi;
  const hostDistricts = `${apiEndpoints.districtsApi}?cityId=`;
  const hostWards = `${apiEndpoints.wardsApi}?districtId=`;

  useEffect(() => {
    fetch(hostCity)
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetch(`${hostDistricts}${selectedCity}`)
        .then((response) => response.json())
        .then((data) => setDistricts(data))
        .catch((error) => console.error("Error fetching districts:", error));
    } else {
      setDistricts([]);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`${hostWards}${selectedDistrict}`)
        .then((response) => response.json())
        .then((data) => setWards(data))
        .catch((error) => console.error("Error fetching wards:", error));
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    const fetchParentDetail = async () => {
      try {
        const response = await ParentApi.getParentDetailPublicWeb(id);
        const parentDetail = response;
        setProfile(parentDetail);
        
        // Fetch cities
        const citiesResponse = await fetch(apiEndpoints.cityApi);
        const citiesData = await citiesResponse.json();
        setInitialCities(citiesData);

        if (citiesData.length > 0) {
          // Find the city ID that matches the parent's saved city name
          const cityName = parentDetail.city?.toLowerCase().trim() || '';
          const city = citiesData.find(city => city.name.toLowerCase().trim() === cityName);
          if (city) {
            const cityId = city.cityId;
            setSelectedCity(cityId);

            // Fetch districts for the selected city
            const districtsResponse = await fetch(`${apiEndpoints.districtsApi}?cityId=${cityId}`);
            const districtsData = await districtsResponse.json();
            setInitialDistricts(districtsData);

            if (districtsData.length > 0) {
              // Find the district ID that matches the parent's saved district name
              const districtName = parentDetail.district?.toLowerCase().trim() || '';
              const district = districtsData.find(district => district.name.toLowerCase().trim() === districtName);
              if (district) {
                const districtId = district.districtId;
                setSelectedDistrict(districtId);

                // Fetch wards for the selected district
                const wardsResponse = await fetch(`${apiEndpoints.wardsApi}?districtId=${districtId}`);
                const wardsData = await wardsResponse.json();
                setInitialWards(wardsData);

                if (wardsData.length > 0) {
                  // Find the ward ID that matches the parent's saved ward name
                  const wardName = parentDetail.ward?.toLowerCase().trim() || '';
                  const ward = wardsData.find(ward => ward.name.toLowerCase().trim() === wardName);
                  if (ward) {
                    setSelectedWard(ward.wardId);
                  }
                }
              }
            }
          }
        }

        // Set avatar image
        setImgs([parentDetail.avatar]);

        // Set form fields value, defaulting null values to empty strings
        form.setFieldsValue({
          fullName: parentDetail.fullName || '',
          email: parentDetail.email || '',
          phone: parentDetail.phone || '',
          city: parentDetail.city || '',
          district: parentDetail.district || '',
          ward: parentDetail.ward || '',
          addressLine: parentDetail.addressLine || '',
        });

      } catch (error) {
        console.error("Error fetching location data or parent details:", error);
      }
    };

    fetchParentDetail();
  }, [id, form, triggerFetch]);


  const validateInputs = (profile) => {
    const phonePattern = /^0\d{9,10}$/;
    const newBackendErrors = {};

    if (!phonePattern.test(profile.phone)) {
      newBackendErrors.phone = 'Please enter a valid phone number';
    }

    if (!profile.fullName) {
      newBackendErrors.fullName = 'This field is required';
    }

    if (!profile.dob) {
      newBackendErrors.dob = 'This field is required';
    } else if (!moment(profile.dob).isBefore(moment())) {
      newBackendErrors.dob = 'Date of birth must be in the past';
    }

    // Removed addressLine validation as it is now optional

    return newBackendErrors;
  };

  const handleSubmit = async () => {
    setIsButtonDisabled(true);
    const newBackendErrors = validateInputs(profile);

    if (Object.keys(newBackendErrors).length > 0) {
      setBackendErrors(newBackendErrors);
      setIsButtonDisabled(false);
      return;
    }

    try {
      // Validate the form fields
      await form.validateFields();

      const selectedCityData = cities.find((city) => city.cityId === selectedCity)?.name || "";
      const selectedDistrictData = districts.find((district) => district.districtId === selectedDistrict)?.name || "";
      const selectedWardData = wards.find((ward) => ward.wardId === selectedWard)?.name || "";

      const updatedProfile = {
        ...profile,
        city: selectedCityData,
        district: selectedDistrictData,
        ward: selectedWardData,
        addressLine: profile.addressLine || "",
        dob: profile.dob ? moment(profile.dob).format("DD/MM/YYYY") : "",
      };

      await ParentApi.updateParent(id, updatedProfile, imgsToSave);
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        setIsButtonDisabled(false);
        window.location.reload();
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Please check your input and try again.");
        setIsButtonDisabled(false);
      } else if (error.response && error.response.data) {
        const { exception } = error.response.data;
        const backendErrors = {};

        Object.keys(exception).forEach((key) => {
          backendErrors[key] = exception[key];
        });

        setBackendErrors(backendErrors);
        setIsButtonDisabled(false);
      } else {
        console.error("Error details:", error.message);
        toast.error("Failed to update profile.");
        setIsButtonDisabled(false);
      }
    }
  };

  const handleChangePassword = async () => {
    setIsButtonDisabled(true);
    try {
      const { oldPassword, newPassword, confirmPassword } = passwords;

      if (newPassword !== confirmPassword) {
        toast.error("New password and confirm password do not match.");
        return;
      }

      const parentPassword = {
        oldPassword: oldPassword,
        newPassword,
      };

      await ParentApi.changePassword(id, parentPassword);
      toast.success("Password changed successfully!");
      setTimeout(() => {
        setIsButtonDisabled(false);
        dispatch(logout());
        navigate("/");
      }, 1500);
    } catch (error) {
      if (error.response && error.response.data) {
        const { exception } = error.response.data;
        const backendErrors = {};

        Object.keys(exception).forEach((key) => {
          backendErrors[key] = exception[key];
        });

        setBackendErrors(backendErrors);
        setIsButtonDisabled(false);
      } else {
        console.error("Error details:", error.message);
        toast.error("Failed to change password.");
        setIsButtonDisabled(false);
      }
    }
  };

  const handleCancel = () => {
    setPasswords({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setImgs([]);
    setImgsToSave([]);
    setBackendErrors({});
    // Trigger a re-fetch of the data
    setTriggerFetch(prev => !prev);
  };

  const handleCityChange = (value) => {
    // Reset selected city
    setSelectedCity(value);

    // Reset district and ward when city changes
    setSelectedDistrict('');
    setSelectedWard('');

    // Clear the district and ward fields in the form
    form.setFieldsValue({
      district: '',
      ward: '',
    });

    // Trigger validation on city change
    form.validateFields(['city', 'district', 'ward']);
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    // Trigger validation on district change
    form.validateFields(['district', 'ward']);
  };

  const handleWardChange = (value) => {
    setSelectedWard(value);
    // Trigger validation on ward change
    form.validateFields(['ward']);
  };

  const handleAddressLineChange = (e) => {
    handleAddressChange(e);
    // Trigger validation on address line change
    form.validateFields(['addressLine']);
  };


  const formattedDob = profile.dob ? moment(profile.dob).format('DD/MM/YYYY') : '';
  return (
    <div>
      <Container style={{ maxWidth: "1150px" }}>
        <Row style={{ margin: '20px 0px 30px -20px' }}>
          <Breadcrumbs />
        </Row>
        <div>
          <h3 className="mt-4">My Profile</h3>
        </div>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="custom-tabs"
        >
          <Tab
            eventKey="myInformation"
            title="My Information"
            className="tab-content-border"
          >
            <Form form={form}>
              <h4 >Account Info</h4 >
              <Row gutter={16}>
                <Col span={12}>
                  <p>Full Name *</p>
                  <FormItem name="fullName" style={{ width: "80%" }} help={backendErrors.fullName || backendErrors.message} validateStatus={backendErrors.fullName ? 'error' : ''}>
                    <Input
                      name="fullName"
                      className="form-control-style-i"
                      placeholder="Enter your full name"
                      onChange={handleChange}
                      value={profile.fullName}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <p>D.O.B</p>
                  <Form.Item
                    name="dob"
                    help={backendErrors.dob || backendErrors.message}
                    validateStatus={backendErrors.dob ? 'error' : ''}
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      style={{ width: '80%' }}
                      className="form-control-style-i"
                      onChange={handleDateChange}
                      placeholder={formattedDob || 'Select your date of birth'}
                    />
                  </Form.Item>
                </Col>

              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <p>Email address *</p>
                  <FormItem name="email" style={{ width: "80%" }}>
                    <Input
                      className="form-control-style-i"
                      placeholder={profile.email}
                      readOnly
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <p>Mobile No. *</p>
                  <FormItem name="phone" style={{ width: "80%" }}
                    help={backendErrors.phone || backendErrors.message}
                    validateStatus={backendErrors.phone ? 'error' : ''}>
                    <Input
                      className="form-control-style-i"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </FormItem>
                </Col>
              </Row>
              <div>
                <h4 style={{ marginTop: '10px', marginBottom: '15px' }}>Address</h4>
              </div>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    style={{ width: '80%' }}
                    name="city"
                    className="form-item-wrapper"
                    rules={[
                      {
                        required: true,
                        message: 'Please select a Province/City.',
                      },
                    ]}
                  >
                    <Select
                      className="select-address-border"
                      placeholder="Province/City"
                      onChange={handleCityChange}
                      value={selectedCity}
                    >
                      {cities.map((city) => (
                        <Select.Option key={city.cityId} value={city.cityId}>
                          {city.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    style={{ width: '80%' }}
                    name="district"
                    className="form-item-wrapper"
                    rules={[
                      {
                        required: true,
                        message: 'Please select a District.',
                      },
                    ]}
                  >
                    <Select
                      className="select-address-border"
                      placeholder="District"
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      style={{ marginTop: '10px' }}
                    >
                      {districts.map((district) => (
                        <Select.Option key={district.districtId} value={district.districtId}>
                          {district.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    style={{ width: '80%' }}
                    name="ward"
                    className="form-item-wrapper"
                    rules={[
                      {
                        required: true,
                        message: 'Please select a Ward.',
                      },
                    ]}
                  >
                    <Select
                      className="select-address-border"
                      placeholder="Ward"
                      value={selectedWard}
                      onChange={handleWardChange}
                      style={{ marginTop: '10px' }}
                    >
                      {wards.map((ward) => (
                        <Select.Option key={ward.wardId} value={ward.wardId}>
                          {ward.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    style={{ width: '80%' }}
                    name="addressLine"
                    className="form-item-wrapper"
                  >
                    <Input
                      name="addressLine"
                      style={{ marginTop: '13px' }}
                      className="form-control-style-i"
                      placeholder="Home Number, Street"
                      value={profile.addressLine}
                      onChange={handleAddressLineChange}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item label="Avatar" wrapperCol={{ span: 24 }}>
                    <Upload
                      style={{
                        width: "100%",
                        height: "100px",
                        border: "2px dashed #ccc",
                      }}
                      listType="picture"
                      onChange={handleUploadChange}
                      beforeUpload={() => false} // Prevent automatic upload
                    >
                      <Button icon={<UploadOutlined />}>
                        Upload your picture
                      </Button>
                    </Upload>

                    <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
                      {imgs.length > 0 ? (
                        imgs.map((img, index) => (
                          <Col xs={24} key={index}>
                            <Image
                              src={img}
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: "15px",
                              }}
                            />
                          </Col>
                        ))
                      ) : (
                        <Col xs={24}>
                          {/* Optionally, display a placeholder or default image */}
                        </Col>
                      )}
                    </Row>
                  </Form.Item>
                </Col>
              </Row>

              <div className="button-group" style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Button type="default" htmlType="button" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="button" disabled={isButtonDisabled} onClick={handleSubmit}>
                  Save
                </Button>
              </div>

            </Form>
          </Tab>
          <Tab
            eventKey="changePassword"
            title="Change Password"
            className="tab-content-border"
          >
            <Form style={{ width: "50%" }} form={form}>

              <p>Current Password:</p>
              <Form.Item
                name="oldPassword"
                validateStatus={backendErrors.oldPassword ? 'error' : backendErrors.message ? 'error' : ''}
                help={backendErrors.oldPassword || backendErrors.message}
              >
                <Input.Password
                  className="form-control-style-i"
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                />
              </Form.Item>


              <p>New Password:</p>
              <Form.Item
                name="newPassword"
                validateStatus={backendErrors.newPassword ? 'error' : ''}
                help={backendErrors.newPassword}
              >
                <Input.Password
                  className="form-control-style-i"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                />
              </Form.Item>

              <div style={{ margin: '5px 0px 25px 0px' }}>
                <i style={{ fontSize: 13 }}>
                  Use at least one letter, one number and seven characters.
                </i>
              </div>

              <p>Confirm Password:</p>
              <Form.Item
                name="confirmPassword"
                validateStatus={confirmPasswordError ? 'error' : ''}
                help={confirmPasswordError}
              >
                <Input.Password
                  className="form-control-style-i"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </Form.Item>

              <div className="button-group" style={{ marginLeft: '250px', marginTop: '70px' }}>
                <Button type="default" htmlType="button" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" onClick={handleChangePassword} disabled={isButtonDisabled} style={{ marginLeft: '75px' }}>
                  Save
                </Button>
              </div>
            </Form>
          </Tab>
        </Tabs>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default ViewParentProfileComponent;
