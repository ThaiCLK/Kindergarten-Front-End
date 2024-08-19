import React, { useState, useEffect } from "react";
import logo from "../assets/img/logo.jpg";
import "../assets/scss/Landing.scss";
import "bootstrap/dist/css/bootstrap.css";
import { FaRegUser } from "react-icons/fa";
import styles from "../assets/scss/Header.module.scss";
import storage from "../utils/storage";
import LogoutModal from "../components/auth/Logout";
import Dropdown from "react-bootstrap/Dropdown";
import { Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ParentApi from "../api/ParentApi";
import Login from "../components/auth/LoginGuest";
import { setupListener, notifyLoginApiCalled } from "../utils/eventEmitter";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    style={{
      fontSize: "17px",
      color: "#19a0fa",
      textDecoration: "none",
    }}
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children} &#x25bc;
  </a>
));


const Header = ({ handleLogin, handleSignUp }) => {
  const [showLogin, setShowLogin] = useState(false);
  const userInfo = storage.getUserInfo();
  const role = userInfo?.role || "";
  const id = userInfo?.id;
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const defaultAvatar = "https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg";
  // const [updateCount, setUpdateCount] = useState(0); // State to trigger re-render

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    if (item === "my-profile") {
      navigate("/home/view-my-profile");
    }
    if (item === "my-schools") {
      navigate("/home/view-my-school");
    }

    if (item === "my-request") {
      navigate(`/home/requests`);
    }
  };

  useEffect(() => {
    const fetchParentDetail = async () => {
      try {
        // Check if the token and user info are present
        const token = storage.getToken();
        const userInfo = storage.getUserInfo();

        if (!token || !userInfo) {
          throw new Error("User is not logged in or token is invalid");
        }

        const response = await ParentApi.getParentDetailPublicWeb(id);
        const parentDetail = response;
        setAvatar(parentDetail.avatar || defaultAvatar);
        setName(parentDetail.fullName || "")
        // setUpdateCount((prevCount) => prevCount + 1);
      } catch (error) {
      }
    };
    fetchParentDetail();
  }, [id, showLogin, navigate]);


  useEffect(() => {

    const fetchParentDetail = async () => {
      try {
        // Check if the token and user info are present
        const token = storage.getToken();
        const userInfo = storage.getUserInfo();

        if (!token || !userInfo) {
          throw new Error("User is not logged in or token is invalid");
        }

        const response = await ParentApi.getParentDetailPublicWeb(userInfo.id);
        const parentDetail = response;
        setAvatar(parentDetail.avatar || defaultAvatar);
        setName(parentDetail.fullName || "")

        // Trigger re-render
        // setUpdateCount((prevCount) => prevCount + 1);

      } catch (error) {
      }
    };

    // Set up the event listener
    const removeListener = setupListener(fetchParentDetail);

    // Cleanup listener when component unmounts
    return () => {
      removeListener(); // Call the function to remove the listener
    };
  }, []);


  useEffect(() => { }, [selectedItem]);

  const renderParentActions = () => (
    <>
      <div>
        <a href="/home/view-my-profile">
          <Image
            src={avatar}
            roundedCircle
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              marginRight: "10px",
            }}
          /></a></div>
      <div>
        <Dropdown className={styles["user-info"]}>
          <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
            Welcome! {name}
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="mt-3"
            style={{
              border: "1px solid #19a0fa",
              borderRadius: "4px",
              minWidth: "200px",
            }}
          >
            {["my-schools", "my-request", "my-profile"].map((item) => (
              <Dropdown.Item
                key={item}
                onClick={() => handleItemClick(item)}
                style={{
                  color: "#19a0fa",
                  borderBottom: "1px solid #19a0fa",
                  padding: "5px 10px",
                  fontWeight: selectedItem === item ? "bold" : "normal",
                  textDecoration: selectedItem === item ? "underline" : "none",
                }}
              >
                {item.replace("my-", "My ").replace("-", " ")}
              </Dropdown.Item>
            ))}
            <Dropdown.Item
              onClick={handleLogoutClick}
              style={{ color: "#19a0fa", padding: "5px 10px" }}
            >
              Log out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <LogoutModal show={showLogoutModal} onClose={handleCloseModal} />
      </div>
    </>
  );

  const renderGuestActions = () => (
    <>
      <FaRegUser className={styles["user-icon"]} style={{ color: "#3C5880" }} />
      <button
        type="button"
        className="btn btn-link"
        style={{ fontSize: "17px", color: "#19a0fa" }}
        onClick={handleLogin}
      >
        Login
      </button>
      <div className={styles.divider}></div>
      <button
        type="button"
        className="btn btn-link"
        style={{ fontSize: "17px", color: "#19a0fa" }}
        onClick={handleSignUp}
      >
        Sign Up
      </button>
    </>
  );

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <a href="/home">
            <Image
              style={{
                marginLeft: "60px",
                margin: "10px 20px",
                objectFit: "cover",
                width: "60%",
                height: "60px",
                borderRadius: "20px",
                boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.24)",
                transition: "transform 0.2s ease",
              }}
              src={logo}
            />
          </a>
        </div>
        <nav>
          {["School Search", "Community", "About Us"].map((item) => (
            <a key={item} href={`/home/search-school?searchKey=&selectedCityId=defaultCity&selectedDistrictId=defaultDistrict`}>
              <b>{item}</b>
            </a>
          ))}
        </nav>
        <div className={styles["user-actions"]}>
          {role === "PARENT" ? renderParentActions() : renderGuestActions()}
        </div>
      </header>
      {showLogin && (
        <Login
          show={showLogin}
          onClose={() => setShowLogin(false)}
          onSignUpClick={handleSignUp}
        />
      )}
    </>
  );
};

export default Header;
