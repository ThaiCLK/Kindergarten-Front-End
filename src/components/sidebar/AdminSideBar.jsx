import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSchool, faUserGear, faBell, faPeopleRoof, faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { Image, Row } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "../../assets/scss/3-components/_adminSideBar.scss"
import logoSchool from "../../assets/img/logo.jpg"
import imageAccount from "../../assets/img/vipro.jpg"
import { useNavigate, Link } from "react-router-dom"
import storage from "../../utils/storage"

function AdminSideBar() {
    const [selectedItem, setSelectedItem] = useState("school")
    const navigate = useNavigate()
    const [role, setRole] = useState("")

    useEffect(() => {
        // Đọc trạng thái từ localStorage khi component được tải
        const savedItem = localStorage.getItem("selectedItem")
        if (savedItem) {
            setSelectedItem(savedItem)
        }
        const user = storage.getUserInfo()
        setRole(user.role)
    }, [localStorage.getItem("selectedItem")])

    const handleItemClick = (item) => {
        setSelectedItem(item)
        // Lưu trạng thái vào localStorage
        localStorage.setItem("selectedItem", item)

        switch (item) {
            case "school":
                navigate("/school-management/school-list")
                break
            case "user":
                navigate("/user-management/user-list")
                break
            case "request":
                navigate("/request-management/request-list")
                break
            case "reminder":
                navigate("/reminder/request-reminder")
                break
            case "parent":
                navigate("/parent-management/parent-list")
                break
            default:
                navigate("/user-management/user-list")
                break
        }
    }

    return (
        <div
            style={{
                backgroundColor: "#D3EEFF",
                alignItems: "center",
                width: "220px"
            }}
            className="custom"
        >
            <Row
                style={{
                    justifyContent: "center",
                    marginBottom: "60px",
                    marginTop: "30px"
                }}
            >
                <Link to="/school-management">
                    <Image
                        style={{
                            marginLeft: "60px",
                            objectFit: "cover",
                            width: "40%",
                            marginTop: "20px",
                            borderRadius: "20px",
                            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.24)",
                            transition: "transform 0.2s ease"
                        }}
                        src={logoSchool}
                    />
                </Link>
            </Row>
            <Row>
                <div
                    className={`itemLeft ${
                        (role === "ADMIN" || role === "SCHOOL_OWNER") && selectedItem === "school" ? "active" : ""
                    }`}
                    onClick={() => handleItemClick("school")}
                >
                    <FontAwesomeIcon icon={faSchool} />
                    <h5 className="titleH5"> SCHOOL MANAGEMENT</h5>
                </div>
                {role === "ADMIN" && (
                    <div
                        className={`itemLeft ${selectedItem === "user" ? "active" : ""}`}
                        onClick={() => handleItemClick("user")}
                    >
                        <FontAwesomeIcon icon={faUserGear} />
                        <h5 className="titleH5">USER MANAGEMENT</h5>
                    </div>
                )}
                <div
                    className={`itemLeft ${selectedItem === "reminder" ? "active" : ""}`}
                    onClick={() => handleItemClick("reminder")}
                >
                    <FontAwesomeIcon icon={faBell} />
                    <h5 className="titleH5">REMINDER </h5>
                </div>
                <div
                    className={`itemLeft ${selectedItem === "parent" ? "active" : ""}`}
                    onClick={() => handleItemClick("parent")}
                >
                    <FontAwesomeIcon icon={faPeopleRoof} />
                    <h5 className="titleH5"> PARENT MANAGEMENT</h5>
                </div>
                <div
                    className={`itemLeft ${selectedItem === "request" ? "active" : ""}`}
                    onClick={() => handleItemClick("request")}
                >
                    <FontAwesomeIcon icon={faEnvelope} />
                    <h5 className="titleH5">REQUEST MANAGEMENT </h5>
                </div>
            </Row>

      <Row
        style={{
          justifyContent: "center",
          marginBottom: "20px",
          marginTop: "40px",
        }}
      >
        <Image
          style={{
            width: "68px",
            height: "45px",
            objectFit: "cover",
            marginTop: "30px",
          }}
          roundedCircle
          src={imageAccount}
        />
      </Row>
    </div>
  );
}

export default AdminSideBar
