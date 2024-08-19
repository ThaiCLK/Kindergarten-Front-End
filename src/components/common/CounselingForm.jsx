import React, { useEffect, useState } from "react"
import { Modal, Button } from "antd"
import "../../assets/scss/CounselingForm.scss"
import RequestApi from "../../api/RequestApi"
import UserApi from "../../api/UserApi"

const CounselingForm = ({ visible, onClose, schoolId }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    question: ""
  })

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [errorQuestion, setErrorQuestion] = useState('');
  const [userDetail, setUserDetail] = useState({});
  const id = JSON.parse(localStorage.getItem('userInfo'))?.id || "";
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.fullName) newErrors.fullName = "Full name is required."
    if (!formData.email) newErrors.email = "Email is required."
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid."
    if (!formData.phone) newErrors.phone = "Phone number is required."
    else if (!/^\+?\d{10,15}$/.test(formData.phone)) newErrors.phone = "Phone number is invalid."
    if (!formData.question) newErrors.question = "Question is required."
    if (formData.question.length > 4000) newErrors.question = "Maximum of question is 4000 character."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await RequestApi.addRequestPublic({ ...formData, schoolId });
      setErrorMessage('');
      onClose();
    } catch (error) {
      setErrorMessage(error.response.data.exception.phone);
      setErrorQuestion(error.response.data.exception.question);
    }
  };

  useEffect(() => {

    async function fetchUsersData() {
      const usersData = await UserApi.getParentDetail(id);
      setUserDetail(usersData);
      setFormData(prevFormData => ({
        ...prevFormData,
        fullName: usersData.fullName || "",
        email: usersData.email || "",
        phone: usersData.phone || "",
        question: ""
      }));
      setErrors("");
      setErrorMessage("")
      setErrorQuestion("")
    }
    if (id != "") {
      fetchUsersData();

    }

  }, [onClose, id])

  return (
    <Modal
      title={<h4 style={{ textAlign: "center" }}>Request Counseling</h4>}
      visible={visible}
      onCancel={onClose}
      footer={null}
      style={{ overflow: 'hidden' }}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <p style={{ textAlign: "center", fontSize: "12px" }}>
            Please check your details below and confirm to submit the request.
          </p>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name..."
            value={formData.fullName}
            onChange={handleChange}
            style={{
              backgroundColor: "#EEEEEE",
              color: "#55555",
              marginBottom: "5px",
            }}
          />
          {errors.fullName && (
            <span className="error" style={{ color: "red" }}>
              {errors.fullName}
            </span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="info@xyz.com"
            value={formData.email}
            onChange={handleChange}
            style={{
              backgroundColor: "#EEEEEE",
              color: "#55555",
              marginBottom: "5px",
            }}
          />
          {errors.email && (
            <span className="error" style={{ color: "red" }}>
              {errors.email}
            </span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Mobile No. :</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+91 - 98596 58000"
            value={formData.phone}
            onChange={handleChange}
            style={{
              backgroundColor: "#EEEEEE",
              color: "#55555",
              marginBottom: "5px",
            }}
          />
          {errorMessage && (
            <p style={{ color: 'red' }}>{errorMessage}</p>
          )}
          {errors.phone && (
            <span className="error" style={{ color: "red" }}>
              {errors.phone}
            </span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="question">Question</label>
          <textarea
            id="question"
            name="question"
            rows="4"
            value={formData.question}
            onChange={handleChange}
            style={{ backgroundColor: "#EEEEEE", color: "#55555" }}
          ></textarea>
          {errorQuestion && (
            <p style={{ color: 'red' }}>{errorQuestion}</p>
          )}
          {errors.question && (
            <span className="error" style={{ color: "red" }}>
              {errors.question}
            </span>
          )}
        </div>
        <p className="note">
          Our staff will contact you within 24 hrs. If you need urgent
          assistance, please contact us via our hotline 0912345688.
        </p>
        <div className="button-group">
          <Button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="submit-btn" htmlType="submit">
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CounselingForm
