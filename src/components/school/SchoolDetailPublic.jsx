import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Container, Tab, Tabs, Button } from "react-bootstrap";
import { Form, Checkbox, Row, Col } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faBitcoinSign,
  faEarthAmericas,
  faEnvelope,
  faLocationDot,
  faPhone,
  faSchoolFlag
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useParams } from "react-router-dom"
import "../../assets/scss/SchoolDetailPublic.scss"
import schoolAPI from "../../api/SchoolApi"
import "bootstrap/dist/css/bootstrap.min.css"
import { Rating } from "@mui/material"
import CounselingForm from "../common/CounselingForm"
import RatingSchoolByUser from "./RatingSchoolByUser"
import SchoolApi from "../../api/SchoolApi"
import CarouselComponent from "../common/CarouselComponent"

import { useLocation } from "react-router-dom"
import PaggingComponent from "../common/PaggingComponent"
import Breadcrumbs from "../common/Breadcrumbs";
import Login from "../auth/LoginGuest";
import SignUp from "../auth/SignUp";
function SchoolDetailPublic() {
  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US").format(number);
  };
  const formatDuration = (input) => {
    return input
      .replace(/(\d+)m/g, "$1 month")
      .replace(/(\d+)y/g, "$1 year")
      .replace(/(\d+) month/, "$1 months")
      .replace(/(\d+) year/, "$1 years")
      .replace("-", " to ")
      .replace(/^/, "From ");
  };
  const [index, setIndex] = useState(0);
  const [facilities, setFacilities] = useState([]);
  const [utilities, setUtilities] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedUtilities, setSelectedUtilities] = useState([]);
  const [school, setSchoolData] = useState({});
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [avarageRatingDetail, setAvarageRatingDetail] = useState([]);
  const [totalRating, setTotalRating] = useState(0);
  const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [starFilter, setStarFilter] = useState([1, 2, 3, 4, 5]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isRate, setIsRate] = useState(1);
  const location = useLocation()
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);  
  const ratingsSectionRef = useRef(null);
  const [schoolIdAfterLogin, setSchoolIdAfterLogin] = useState(-1);
  const [selectedButton, setSelectedButton] = useState(-1);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab');

    if (tab === 'Ratings') {
      setActiveTab('Ratings');
      setTimeout(() => {
        if (ratingsSectionRef.current) {
          ratingsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);
  const roundToNearestWhole = (num) => {
    return Math.round(num);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false)
  }
  const showModal1 = () => {
    setIsModalVisible1(true)
  }

  const handleClose1 = () => {
    setIsModalVisible1(false);
    setIsRate(isRate + 1);
  };
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, "MMM do, yyyy h:mm a", { locale: enUS });
  };
  useEffect(() => {
    const fetchRatingFeature = async () => {
      try {
        const ratings = await SchoolApi.getRatingById(id);
        setAvarageRatingDetail(ratings.data.ratings);
        setTotalRating(ratings.data.totalRating);
        const total = ratings.data.ratings.reduce(
          (acc, rate) => acc + rate.averageRatingValue,
          0
        );
        setAverageRating(total / ratings.data.ratings.length);
      } catch (error) {
        console.error("Error fetching school detail:", error);
      }
    };
    fetchRatingFeature();
  }, [isRate]);

  const [rating, setRating] = useState({});
  useEffect(() => {
    async function fetchSchoolsRating(startDate, endDate, schoolId) {
      const RatingData = await schoolAPI.getRatingByDate(
        startDate,
        endDate,
        schoolId
      );
      setRating(RatingData || []);
    }
    fetchSchoolsRating("", "", 5);
  }, [isRate]);

  useEffect(() => {
    if (rating.ratings && rating.ratings.length > 0) {
      const total = rating.ratings.reduce(
        (acc, rate) => acc + rate.averageRatingValue,
        0
      );
      const avg = total / rating.ratings.length;
      setAverageRating(avg);
    } else {
      setAverageRating(0);
    }
  }, [rating, isRate]);

  useEffect(() => {
    const fetchSchoolDetail = async () => {
      try {
        const [facilitiesData, utilitiesData, schoolDetail] = await Promise.all([
          schoolAPI.getSchoolFacilities(),
          schoolAPI.getSchoolUtilities(),
          schoolAPI.fetchSchoolDetail(id)
        ])

        setFacilities(facilitiesData)
        setUtilities(utilitiesData)

        const facilityIds = schoolDetail.facilities.map((facility) => facility.id)
        const utilityIds = schoolDetail.utilities.map((utility) => utility.id)

        setSelectedFacilities(facilityIds)
        setSelectedUtilities(utilityIds)
        setSchoolData(schoolDetail)
        if (schoolDetail.images && schoolDetail.images.length > 0) {
          setImages(schoolDetail.images)
        } else {
          setImages([
            {
              id: 0,
              imagePath:
                "https://img.freepik.com/free-vector/kindergarten-school-scene-with-two-children-playing-toys-room_1308-61743.jpg"
            }
          ])
        }
      } catch (error) {
        console.error("Error fetching school detail:", error)
      }
    }

    fetchSchoolDetail();
  }, [isRate]);

  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }
  const handlePageChange = (pageNumber) => {
    setPageNo(pageNumber)
  }
  const handleSelect1 = (selectedIndex) => {
    setCurrentIndex(selectedIndex)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000) // Chuyển slide mỗi 3 giây
    return () => clearInterval(interval) // Dọn dẹp interval khi component unmount
  }, [currentIndex]) // Chạy lại useEffect khi currentIndex thay đổi

  useEffect(() => {
    async function filterSchoolsFeedback(schoolId) {
      const FeedbackData = await SchoolApi.getFeedbackByFilter(
        schoolId,
        starFilter,
        pageNo
      );
      setFeedbacks(FeedbackData.data.item || []);
      setPageNo(FeedbackData.data.pageNo);
      setTotalPage(FeedbackData.data.totalPage);
    }
    filterSchoolsFeedback(id, starFilter, pageNo);
  }, [starFilter, pageNo, totalPage, isRate]);
  const navigate = useNavigate();
  const handleSignUp = () => {
    setShowSignUp(true);
    setShowLogin(false);

  };

  const handleShowLoginAfterSignUp = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  const handleButtonNotLogin = () => {
    const a = JSON.parse(localStorage.getItem("userInfo"));
    if(!a){
         localStorage.setItem("keyIdSchool", id);
    setShowLogin(true);
    setSchoolIdAfterLogin(id);
    }else{
      setIsModalVisible(id);
    }
    
  }

  const handleButtonNotLoginRating = () => {
    const a = JSON.parse(localStorage.getItem("userInfo"));
    if(!a){
    setShowLogin(true);
    }
  }
  useEffect(() => {
    const a = localStorage.getItem("isLogOk");
    localStorage.removeItem("keyIdSchool");
    localStorage.removeItem("isLogOk");
    if(a){
      setIsModalVisible(schoolIdAfterLogin);
    }  
  }, [localStorage.getItem("isLogOk")]);
  function handleActiveButton(){
    
  }
  return (
    <div style={{ margin: '10px 30px' }}>
       {showLogin && (
        <Login
          show={showLogin}
          onClose={() => setShowLogin(false)}
          onSignUpClick={handleSignUp}
        />
      )}
      {showSignUp && (
        <SignUp
          show={showSignUp}
          onClose={() => setShowSignUp(false)}
          onShowLogin={handleShowLoginAfterSignUp}
        />
      )}
      <Row style={{ margin: '0px 0px 10px 0px' }}>
        <Breadcrumbs />
      </Row>
      <CarouselComponent images={images} />

      {school && (
        <div>
          <div className="school-card" key={school.id}>
            <Row className="school-info">
              <Col sm={12}>
                <Row className="info-row" style={{ margin: "0px 0px 15px 10px" }}>
                  <h2 style={{ fontWeight: "bolder" }}>{school.name}</h2>
                </Row>

                <Row className="info-row">
                  <Col style={{ display: "flex" }} sm={5}>
                    <FontAwesomeIcon className="icon_infor" icon={faLocationDot} />
                    <div
                      className="icon_title"
                      style={{
                        marginLeft: "5px",
                        fontSize: "15px"
                      }}
                    >
                      Address:
                    </div>
                  </Col>
                  <Col>
                    <span>
                      {school.addressLine}, {school.ward}, {school.district}, {school.city}
                    </span>
                  </Col>
                </Row>
                <Row className="info-row">
                  <Col style={{ display: "flex" }} sm={5}>
                    <FontAwesomeIcon className="icon_infor" icon={faEnvelope} />
                    <div
                      className="icon_title"
                      style={{
                        marginLeft: "8px",
                        fontSize: "15px"
                      }}
                    >
                      Email:
                    </div>
                  </Col>
                  <Col>
                    <span>{school.email}</span>
                  </Col>
                </Row>
                <Row className="info-row">
                  <Col style={{ display: "flex" }} sm={5}>
                    <FontAwesomeIcon icon="fa-thin fa-phone" />
                    <FontAwesomeIcon className="icon_infor" icon={faPhone} />
                    <div
                      className="icon_title"
                      style={{
                        marginLeft: "8px",
                        fontSize: "15px"
                      }}
                    >
                      Contact:
                    </div>
                  </Col>
                  <Col>
                    <span>{school.phone}</span>
                  </Col>
                </Row>
                <Row className="info-row">
                  <Col style={{ display: "flex" }} sm={5}>
                    <FontAwesomeIcon className="icon_infor" icon={faEarthAmericas} />
                    <div
                      className="icon_title"
                      style={{
                        marginLeft: "8px",
                        fontSize: "15px"
                      }}
                    >
                      Website:
                    </div>
                  </Col>
                  <Col>
                    <a href={""}>ABC.edu.naruto</a>
                  </Col>
                </Row>

                <Row className="info-row">
                  <Col style={{ display: "flex" }} sm={5}>
                    <FontAwesomeIcon
                      className="icon_infor"
                      icon={faBitcoinSign}
                    />
                    <div
                      className="icon_title"
                      style={{ marginLeft: "8px", fontSize: "15px" }}
                    >
                      Tuition Fee:
                    </div>
                  </Col>
                  <Col>
                    <span> From {formatNumber(school.feeFrom)} VND/ month</span>
                  </Col>
                </Row>

                <Row className="info-row">
                  <Col style={{ display: "flex" }} sm={5}>
                    <FontAwesomeIcon
                      className="icon_infor"
                      icon={faAddressBook}
                    />
                    <div
                      className="icon_title"
                      style={{ marginLeft: "8px", fontSize: "15px" }}
                    >
                      Admission age:
                    </div>
                  </Col>
                  <Col>
                    <span>{formatDuration(school?.age?.rangeAge || "")}</span>
                  </Col>
                </Row>

                <Row className="info-row">
                  <Col style={{ display: "flex" }} sm={5}>
                    <FontAwesomeIcon
                      className="icon_infor"
                      icon={faSchoolFlag}
                    />
                    <div
                      className="icon_title"
                      style={{ marginLeft: "8px", fontSize: "15px" }}
                    >
                      School Type:
                    </div>
                  </Col>
                  <Col>
                    <span>{school?.type?.type}</span>
                  </Col>
                </Row>
              </Col>

              <Col
                sm={12}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "end"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  {storedUserInfo != null ? (
                    <Button
                      style={{
                        backgroundColor: "#19A0FA"
                      }}
                      onClick={showModal}
                      className="request-button"
                    >
                      Request Counseling
                    </Button>
                  ) : (
                    <Button onClick={() => handleButtonNotLogin()} className="request-button">
                      Request Counseling
                    </Button>
                  )}
                  {storedUserInfo != null ? (
                    <Button
                      onClick={showModal1}
                      className="secondButton"
                      style={{
                        backgroundColor: "white",
                        color: "#19A0FA"
                      }}
                    >
                      Rate School
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleButtonNotLoginRating()}
                      className="secondButton"
                      style={{
                        backgroundColor: "white",
                        color: "#19A0FA"
                      }}
                    >
                      Rate School
                    </Button>
                  )}
                </div>

                <RatingSchoolByUser
                  visible={isModalVisible1}
                  onClose={handleClose1}
                  schoolId={id}
                />
                <CounselingForm
                  visible={isModalVisible}
                  onClose={handleClose}
                  schoolId={id}
                  style={{overflow:'hidden'}}
                />
                <div className="rating" style={{ display: "flex" }}>
                  <Rating
                    name="half-rating-read"
                    value={school.averageRating}
                    precision={0.5}
                    readOnly
                    style={{ fontSize: "20px" }}
                  />
                  <span className="rating-text">
                    {school?.averageRating}/5.0({school.totalRating} rating)
                  </span>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        id="uncontrolled-tab-example"
        className="mb-3"
        style={{ borderRadius: "20px" }}
      >
        <Tab
          eventKey="Overview"
          title="Overview"
          className="overviewTab"
          style={{ padding: "20px" }}
        >
          <Container>
            <h2 style={{ margin: "15px 0px", fontWeight: "400" }}>
              School Introduction
            </h2>

            <div dangerouslySetInnerHTML={{ __html: school.introduction }} />
            <h2 style={{ marginTop: "10px", fontWeight: "400" }}>Facilities</h2>
            <Form.Item>
              <Checkbox.Group value={selectedFacilities} disabled>
                <Row gutter={[16, 16]}>
                  {facilities.map((option) => (
                    <Col span={8} key={option.id} className="custom-checkbox">
                      <Checkbox
                        value={option.id}
                        className="custom-checkbox-disabled"
                      >
                        {option.name}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <h2 style={{ marginTop: "10px", fontWeight: "400" }}>Utilities</h2>
            <Checkbox.Group value={selectedUtilities} disabled>
              <Row gutter={[16, 16]}>
                {utilities.map((option) => (
                  <Col span={8} key={option.id} className="custom-checkbox">
                    <Checkbox
                      value={option.id}
                      className="custom-checkbox-disabled"
                    >
                      {option.name}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Container>
        </Tab>
        <Tab eventKey="Ratings" title="Ratings" className="overviewTab">
          <div id="ratings-section" ref={ratingsSectionRef}>
            <h3>Average ratings</h3>
            <h4 style={{ textAlign: "center" }}>
              {school?.averageRating} star ({school.totalRating} rating)
            </h4>
            <div style={{ textAlign: "center" }}>
              <Rating
                name="half-rating-read"
                value={school.averageRating * 1}
                precision={0.5}
                readOnly
                style={{ fontSize: "30px" }}
              />
            </div>
            <div style={{ width: "700px", margin: "0 auto" }}>
              {avarageRatingDetail?.map((item, index) => (
                <div key={index} className="rating-row">
                  <div className="label">{item.criteriaName}:</div>
                  <div className="rating-bar">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`segments ${roundToNearestWhole(item.averageRatingValue) > i
                          ? ""
                          : "empty"
                          }`}
                      ></div>
                    ))}
                  </div>
                  <div className="score">({item.averageRatingValue}/5)</div>
                </div>
              ))}
            </div>

            <h3>Detail</h3>
            <div class="button-group-detail">
              <button
                onClick={() => {
                  setStarFilter([1, 2, 3, 4, 5]);
                  setPageNo(1);
                  
                }}
                className={`rating-button-detail ${starFilter.length > 1 ? 'active' : ''}`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setStarFilter([5]);
                  setPageNo(1);
                  
                }}
                className={`rating-button-detail ${starFilter[0] === 5 ? 'active' : ''}`}
                >
                5 ★
              </button>
              <button
                onClick={() => {
                  setStarFilter([4]);
                  setPageNo(1);
                  
                }}
                className={`rating-button-detail ${starFilter[0] === 4 ? 'active' : ''}`}
              >
                4 ★
              </button>
              <button
                onClick={() => {
                  setStarFilter([3]);
                  setPageNo(1);
                  
                }}
                className={`rating-button-detail ${starFilter[0] === 3 ? 'active' : ''}`}
              >
                3 ★
              </button>
              <button
                onClick={() => {
                  setStarFilter([2]);
                  setPageNo(1);
                  
                }}
                className={`rating-button-detail ${starFilter[0] === 2 ? 'active' : ''}`}
              >
                2 ★
              </button>
              <button
                onClick={() => {
                  setStarFilter([1]);
                  setPageNo(1);
                  
                }}
                className={`rating-button-detail ${(starFilter[0] === 1 && starFilter.length == 1) ? 'active' : ''}`}
              >
                1 ★
              </button>
            </div>
            <div className="divider"> </div>
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback, index) => (
                <Row
                  className="details-box"
                  style={{ marginBottom: "10px", display: "flex" }}
                  key={index}
                >
                  <Col className="details-left" sm={13}>
                    <Col
                      style={{
                        width: "50px",
                        maxWidth: "50px",
                        height: "50px",
                        maxHeight: "50px",
                        marginRight: "15px",
                      }}
                    >
                      <img
                        src="https://wallup.net/wp-content/uploads/2015/12/85466-Naruto_Shippuuden-manga-anime-Uzumaki_Naruto.jpg"
                        alt={feedback.name}
                        style={{
                          width: "50px",
                          maxWidth: "50px",
                          height: "50px",
                          maxHeight: "50px",
                        }}
                      />
                    </Col>
                    <Col>
                      <Row>
                        <Col>
                          <h5>{feedback.name}</h5>{" "}
                          <p style={{ fontSize: "13px" }}>
                            {formatDate(feedback.createDate)}
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <p>{feedback.content}</p>
                      </Row>
                    </Col>
                  </Col>
                  <Col
                    className="separator"
                    sm={0.03}
                    style={{
                      height: "200px",
                      backgroundColor: ' #89B5CC',
                      margin: "auto",
                      minWidth: '0.3px'
                    }}
                  ></Col>
                  <Col
                    className="details-right"
                    sm={8}
                    style={{ paddingLeft: "20px" }}
                  >
                    <Row>
                      <Col sm={11}>
                        <h5>Overall Rating</h5>
                      </Col>
                      <Col sm={13}>
                        <Rating
                          name="half-rating-read"
                          value={feedback.averageCriteriaValue}
                          precision={0.5}
                          readOnly
                          style={{ fontSize: "35px" }}
                        />
                      </Col>
                    </Row>
                    {feedback.ratings && feedback.ratings.length > 0 ? (
                      <div>
                        {feedback.ratings.map((item, key) => (
                          <Row className="r-rating" key={key}>
                            <Col sm={11}>
                              <p>{item.criteriaName}</p>
                            </Col>
                            <Col sm={13} style={{ display: "flex" }}>
                              <Rating
                                style={{ fontSize: "20px" }}
                                name="half-rating-read"
                                value={item.averageRatingValue}
                                precision={0.5}
                                readOnly
                              />
                              <div>({item.averageRatingValue}/5)</div>
                            </Col>
                          </Row>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <h5>There is no one rating!</h5>
                      </div>
                    )}
                  </Col>
                </Row>
              ))
            ) : (
              <h5>There is no feedback!</h5>
            )}
            <div style={{ paddingTop: "20px" }}>
              <PaggingComponent
                count={totalPage}
                currentPage={pageNo}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default SchoolDetailPublic
