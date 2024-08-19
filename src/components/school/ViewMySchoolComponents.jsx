import React, { useEffect, useState } from "react"
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap"
import { Button, Form, Input, Select } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faAddressBook,
    faBitcoinSign,
    faEarthAmericas,
    faLightbulb,
    faLocationDot,
    faSchoolFlag
} from "@fortawesome/free-solid-svg-icons"
import { Link, useNavigate, useParams } from "react-router-dom"
import schoolAPI from "../../api/SchoolApi"
import { Rating } from "@mui/material"
import RatingSchoolByUser from "./RatingSchoolByUser"
import PaggingComponent from "../common/PaggingComponent"
import Breadcrumbs from "../common/Breadcrumbs"

function ViewMySchoolComponents() {
    const [currentSchool, setCurrentSchool] = useState([])
    const [previousSchool, setPreviousSchool] = useState([])
    const [isModalVisible1, setIsModalVisible1] = useState(false)
    const [totalPage, setTotalPage] = useState(1);
    const [isRate, setIsRate] = useState(1);
    const [pageNo, setPageNo] = useState(1);
    const handlePageChange = (pageNumber) => {
        setPageNo(pageNumber)
    }
    const navigate = useNavigate()
    const formatNumber = (number) => {
        return new Intl.NumberFormat("en-US").format(number);
    };

    useEffect(() => {
        async function fetchCurrentSchool() {
            const data = await schoolAPI.getCurrentSchool()
            setCurrentSchool(data)
        }
        fetchCurrentSchool()
    }, [])
    useEffect(() => {
        async function fetchCurrentSchool() {
            const data = await schoolAPI.getCurrentSchool()
            setCurrentSchool(data)
        }
        fetchCurrentSchool()
    }, [isRate])


    useEffect(() => {
        async function fetchPreviousSchool() {
            const data = await schoolAPI.getPreviousSchool(pageNo)
            setPreviousSchool(data.item)
            setTotalPage(data.totalPage)
        }
        fetchPreviousSchool()
    }, [pageNo])
    const showModal1 = () => {

        setIsModalVisible1(true)
    }
    const formatDuration = (input) => {
        return input
            .replace(/(\d+)m/g, "$1 month")
            .replace(/(\d+)y/g, "$1 year")
            .replace(/(\d+) month/, "$1 months")
            .replace(/(\d+) year/, "$1 years")
            .replace("-", " to ")
            .replace(/^/, "From ");
    };
    const handleClose1 = () => {
        setIsModalVisible1(false)
        setIsRate(isRate + 1);
    }
    return (
        <Container>
            <Row style={{ margin: '20px 0px 30px -20px' }}>
                <Breadcrumbs />
            </Row>
            <h3 style={{ margin: "40px 0px" }}>My School</h3>
            <Tabs defaultActiveKey="Current" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="Current" title="Current school">
                    {currentSchool.length > 0 ? (
                        currentSchool.map((school) => (
                            <Container style={{ display: "flex" }}>
                                <Col className="school-card" sm={9} style={{ marginRight: "20px" }}>
                                    <div>
                                        <img
                                            src={school.schoolDetail?.images[0]?.imagePath}
                                            className="school-image"
                                            style={{ width: "300px" }}
                                        />
                                        <div style={{ margin: "20px" }}>
                                            <Rating
                                                name="half-rating-read"
                                                value={school.schoolDetail.averageRating}
                                                precision={0.5}
                                                readOnly
                                                style={{ fontSize: "15px" }}
                                            />
                                            <span>
                                                {" "}
                                                {school.schoolDetail.averageRating}
                                                /5 ({school.schoolDetail.totalRating} ratings)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="school-info">
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            <h4>
                                                <Link
                                                    to={`/home/search-school/school-detail/${school.schoolDetail.id}`}
                                                >
                                                    {school.schoolDetail.name}
                                                </Link>{" "}
                                            </h4>
                                        </div>

                                        <Row className="info-row">
                                            <Col style={{ display: "flex" }} sm={3}>
                                                <FontAwesomeIcon className="icon_infor" icon={faLocationDot} />
                                                <div
                                                    className="icon_title"
                                                    style={{
                                                        marginLeft: "5px"
                                                    }}
                                                >
                                                    Address:
                                                </div>
                                            </Col>
                                            <Col>
                                                <span>
                                                    {school.schoolDetail.addressLine}, {school.schoolDetail.ward},{" "}
                                                    {school.schoolDetail.district}, {school.schoolDetail.city}
                                                </span>
                                            </Col>
                                        </Row>

                                        <Row className="info-row">
                                            <Col style={{ display: "flex" }} sm={3}>
                                                <FontAwesomeIcon className="icon_infor" icon={faEarthAmericas} />
                                                <div
                                                    className="icon_title"
                                                    style={{
                                                        marginLeft: "5px"
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
                                            <Col style={{ display: "flex" }} sm={3}>
                                                <FontAwesomeIcon className="icon_infor" icon={faBitcoinSign} />
                                                <div
                                                    className="icon_title"
                                                    style={{
                                                        marginLeft: "5px"
                                                    }}
                                                >
                                                    Tuition Fee:
                                                </div>
                                            </Col>
                                            <Col>
                                                <span>From {formatNumber(school.schoolDetail.feeFrom)} VND/ month
                                                </span>
                                            </Col>
                                        </Row>

                                        <Row className="info-row">
                                            <Col style={{ display: "flex" }} sm={3}>
                                                <FontAwesomeIcon className="icon_infor" icon={faAddressBook} />
                                                <div
                                                    className="icon_title"
                                                    style={{
                                                        marginLeft: "5px"
                                                    }}
                                                >
                                                    Admission age:
                                                </div>
                                            </Col>
                                            <Col>
                                                <span>{formatDuration(school.schoolDetail?.age?.rangeAge)}</span>

                                            </Col>
                                        </Row>

                                        <Row className="info-row">
                                            <Col style={{ display: "flex" }} sm={3}>
                                                <FontAwesomeIcon className="icon_infor" icon={faSchoolFlag} />
                                                <div
                                                    className="icon_title"
                                                    style={{
                                                        marginLeft: "5px"
                                                    }}
                                                >
                                                    School Type:
                                                </div>
                                            </Col>
                                            <Col>
                                                <span>{school.schoolDetail.type.type}</span>
                                            </Col>
                                        </Row>

                                        <Row className="facilities">
                                            <Col style={{ display: "flex" }} sm={3}>
                                                <FontAwesomeIcon className="icon_infor" icon={faLightbulb} />
                                                <div
                                                    className="icon_title"
                                                    style={{
                                                        marginLeft: "5px"
                                                    }}
                                                >
                                                    Facilities and Utilities:
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="facility-tags">
                                                    {school.schoolDetail.facilities.map((facility, index) => (
                                                        <span className="facility-tag" key={index}>
                                                            {facility.name}
                                                        </span>
                                                    ))}
                                                    {school.schoolDetail.utilities.map((utilities, index) => (
                                                        <span className="facility-tag" key={index}>
                                                            {utilities.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                {school.rating == null ? (
                                    <Col
                                        sm={3}
                                        className="school-card"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column"
                                        }}
                                    >
                                        <Row>
                                            <h5
                                                style={{
                                                    textAlign: "center",
                                                    color: "#007bff",
                                                    padding: "20px",
                                                    marginTop: "50px"
                                                }}
                                            >
                                                You haven't rate the school yet. Please share with us your feedback.
                                            </h5>
                                        </Row>
                                        <Row>
                                            <Button
                                                style={{
                                                    width: "120px",
                                                    margin: "auto",
                                                    marginTop: "20px",
                                                    height: "50px",
                                                    backgroundColor: "#007bff",
                                                    color: "white",
                                                    borderColor: "white",
                                                    whiteSpace: "normal",
                                                    boxShadow: "1 6px 10px rgba(0, 0, 0, 0.1)"
                                                }}
                                                onClick={showModal1}
                                            >
                                                Rate school
                                            </Button>
                                            <RatingSchoolByUser
                                                visible={isModalVisible1}
                                                onClose={handleClose1}
                                                schoolId={school.schoolDetail.id}
                                            />
                                        </Row>
                                    </Col>
                                ) : (
                                    <Col
                                        sm={3}
                                        className="school-card"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column"
                                        }}
                                    >
                                        <Row>
                                            <h5
                                                style={{
                                                    textAlign: "center",
                                                    color: "#007bff",
                                                    padding: "20px"
                                                }}
                                            >
                                                Your average rating
                                            </h5>
                                        </Row>
                                        <Row>
                                            <span style={{ textAlign: "center" }}>{school.rating}/5</span>
                                        </Row>
                                        <Row>
                                            <Rating
                                                name="half-rating-read"
                                                value={school.rating}
                                                precision={0.5}
                                                readOnly
                                                style={{
                                                    fontSize: "30px",
                                                    margin: "auto"
                                                }}
                                            />
                                        </Row>
                                        <Row>
                                            <Button
                                                style={{
                                                    width: "120px",
                                                    margin: "auto",
                                                    marginTop: "40px",
                                                    height: "50px",
                                                    color: "#007bff",
                                                    borderColor: "#007bff",
                                                    whiteSpace: "normal",
                                                    boxShadow: "1 6px 10px rgba(0, 0, 0, 0.1)"
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        `/home/search-school/school-detail/${school.schoolDetail.id}?tab=Ratings`
                                                    )
                                                }
                                            >
                                                View Rating Detail
                                            </Button>
                                        </Row>
                                    </Col>
                                )}
                            </Container>
                        ))
                    ) : (
                        <span>There is no school is enrolled</span>
                    )}
                </Tab>

                <Tab eventKey="Priveous" title="Previous school">
                    <span style={{ marginBottom: "30px" }}>
                        There's {previousSchool.length} school that priveously enrolled in
                    </span>
                    {previousSchool.length > 0 ? (
                        previousSchool?.map((school) => (
                            <Container style={{ display: "flex", marginTop: "20px" }}>
                                <Col
                                    className="school-card"
                                    sm={9}
                                    style={{
                                        marginRight: "20px",
                                        marginLeft: "-12px"
                                    }}
                                >
                                    <div>
                                        <img
                                            src={school.schoolDetail.images[0]?.imagePath}
                                            className="school-image"
                                            style={{ width: "300px" }}
                                        />
                                        <div style={{ margin: "20px" }}>
                                            <Rating
                                                name="half-rating-read"
                                                value={school.schoolDetail.averageRating}
                                                precision={0.5}
                                                readOnly
                                                style={{ fontSize: "15px" }}
                                            />
                                            <span>
                                                {" "}
                                                {school.schoolDetail.averageRating}
                                                /5 ({school.schoolDetail.totalRating} rating)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="school-info">
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            <h4>
                                                <Link
                                                    to={`/home/search-school/school-detail/${school.schoolDetail.id}`}
                                                >
                                                    {school.schoolDetail.name}
                                                </Link>{" "}
                                            </h4>
                                        </div>

                                        <Row className="info-row">
                                            <Col style={{ display: "flex" }} sm={3}>
                                                <FontAwesomeIcon className="icon_infor" icon={faLocationDot} />
                                                <div
                                                    className="icon_title"
                                                    style={{
                                                        marginLeft: "5px"
                                                    }}
                                                >
                                                    Address:
                                                </div>
                                            </Col>
                                            <Col>
                                                <span>
                                                    {school.schoolDetail.addressLine}, {school.schoolDetail.ward},{" "}
                                                    {school.schoolDetail.district}, {school.schoolDetail.city}
                                                </span>
                                            </Col>
                                        </Row>

                                        <Row className="info-row">
                                            <Col style={{ display: "flex" }} sm={3}>
                                                <FontAwesomeIcon className="icon_infor" icon={faEarthAmericas} />
                                                <div
                                                    className="icon_title"
                                                    style={{
                                                        marginLeft: "5px"
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
                                            <Col style={{ display: "flex" }} sm={3}>
                                                <FontAwesomeIcon className="icon_infor" icon={faBitcoinSign} />
                                                <div
                                                    className="icon_title"
                                                    style={{
                                                        marginLeft: "5px"
                                                    }}
                                                >
                                                    Tuition Fee:
                                                </div>
                                            </Col>
                                            <Col>
                                                <span>From {formatNumber(school.schoolDetail.feeFrom)} VND/ month
                                                </span>
                                            </Col>
                                        </Row>

                                        <Row className="info-row">
                                            <Col style={{ display: "flex" }} sm={3}>
                                                <FontAwesomeIcon className="icon_infor" icon={faAddressBook} />
                                                <div
                                                    className="icon_title"
                                                    style={{
                                                        marginLeft: "5px"
                                                    }}
                                                >
                                                    Admission age:
                                                </div>
                                            </Col>
                                            <Col>
                                                <span>{formatDuration(school.schoolDetail?.age?.rangeAge)}</span>
                                            </Col>
                                        </Row>

                                        <Row className="info-row">
                                            <Col style={{ display: "flex" }} sm={3}>
                                                <FontAwesomeIcon className="icon_infor" icon={faSchoolFlag} />
                                                <div
                                                    className="icon_title"
                                                    style={{
                                                        marginLeft: "5px"
                                                    }}
                                                >
                                                    School Type:
                                                </div>
                                            </Col>
                                            <Col>
                                                <span>{school.schoolDetail.type.type}</span>
                                            </Col>
                                        </Row>

                                        <Row className="facilities">
                                            <Col style={{ display: "flex" }} sm={3}>
                                                <FontAwesomeIcon className="icon_infor" icon={faLightbulb} />
                                                <div
                                                    className="icon_title"
                                                    style={{
                                                        marginLeft: "5px"
                                                    }}
                                                >
                                                    Facilities and Utilities:
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="facility-tags">
                                                    {school.schoolDetail.facilities.map((facility, index) => (
                                                        <span className="facility-tag" key={index}>
                                                            {facility.name}
                                                        </span>
                                                    ))}
                                                    {school.schoolDetail.utilities.map((utilities, index) => (
                                                        <span className="facility-tag" key={index}>
                                                            {utilities.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                {school.rating == null ? (
                                    <Col
                                        sm={3}
                                        className="school-card"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column"
                                        }}
                                    >
                                        <Row>
                                            <h5
                                                style={{
                                                    textAlign: "center",
                                                    color: "#007bff",
                                                    padding: "20px",
                                                    marginTop: "50px"
                                                }}
                                            >
                                                There is no rating of yours for this school. You can only rate the
                                                school you are currently enrolled in.
                                            </h5>
                                        </Row>
                                    </Col>
                                ) : (
                                    <Col
                                        sm={3}
                                        className="school-card"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column"
                                        }}
                                    >
                                        <Row>
                                            <h5
                                                style={{
                                                    textAlign: "center",
                                                    color: "#007bff",
                                                    padding: "20px"
                                                }}
                                            >
                                                Your average rating
                                            </h5>
                                        </Row>
                                        <Row>
                                            <span style={{ textAlign: "center" }}>{school.rating}/5</span>
                                        </Row>
                                        <Row>
                                            <Rating
                                                name="half-rating-read"
                                                value={school.rating}
                                                precision={0.5}
                                                readOnly
                                                style={{
                                                    fontSize: "30px",
                                                    margin: "auto"
                                                }}
                                            />
                                        </Row>
                                        <Row>
                                            <Button
                                                style={{
                                                    width: "120px",
                                                    margin: "auto",
                                                    marginTop: "40px",
                                                    height: "50px",
                                                    color: "#007bff",
                                                    borderColor: "#007bff",
                                                    whiteSpace: "normal",
                                                    boxShadow: "1 6px 10px rgba(0, 0, 0, 0.1)"
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        `/home/search-school/school-detail/${school.schoolDetail.id}?tab=Ratings`
                                                    )
                                                }
                                            >
                                                View Rating Detail
                                            </Button>
                                        </Row>
                                    </Col>
                                )}
                            </Container>
                        ))
                    ) : (
                        <></>
                    )}
                    <div style={{ paddingTop: "20px" }}>
                        <PaggingComponent count={totalPage} currentPage={pageNo} onPageChange={handlePageChange} />
                    </div>
                </Tab>
            </Tabs>
        </Container>
    )
}

export default ViewMySchoolComponents
