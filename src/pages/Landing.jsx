import React, { useState, useEffect } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import staffImage from "../assets/img/vipro.jpg"
import logo from "../assets/img/image.png"
import "../assets/scss/Landing.scss"
import Footer from "../components/Footer"
import "bootstrap/dist/css/bootstrap.css"
import { MdOutlineMapsHomeWork } from "react-icons/md"
import { IoLocationOutline } from "react-icons/io5"
import { GrUserManager } from "react-icons/gr"
import { FaRegNewspaper } from "react-icons/fa"
import { MdOutlineCastForEducation } from "react-icons/md"
import { AiOutlineDiscord } from "react-icons/ai"
import Login from "../components/auth/Login"
import SignUp from "../components/auth/SignUp"
import schoolAPI from "../api/SchoolApi"
import { Rating } from "@mui/material"

const Landing = () => {
    const [showLogin, setShowLogin] = useState(false)
    const [showSignUp, setShowSignUp] = useState(false)

    const handleLogin = () => {
        setShowLogin(true)
        setShowSignUp(false)
    }

    const handleCloseLogin = () => {
        setShowLogin(false)
    }

    const handleSignUp = () => {
        setShowSignUp(true)
        setShowLogin(false)
    }

    const handleCloseSignUp = () => {
        setShowSignUp(false)
    }

    const handleShowLoginAfterSignUp = () => {
        setShowSignUp(false)
        setShowLogin(true)
    }
    const [feedbackTop, setFeedbackTop] = useState([])
    // fetch feedback:
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await schoolAPI.getSchoolTopFeedback()
                setFeedbackTop(response.data.feedbacks || [])
            } catch (error) {
                console.error("Error fetching required data:", error)
            }
        }
        fetchData()
    }, [])
    return (
        <div className="landing-page">
            <Header handleLogin={handleLogin} handleSignUp={handleSignUp} />
            <SearchSection />
            <Testimonials feedbackTop={feedbackTop} />
            <AboutUs />
            <VisitUs />
            <Footer />
            {showLogin && <Login show={showLogin} onClose={handleCloseLogin} onSignUpClick={handleSignUp} />}
            {showSignUp && (
                <SignUp show={showSignUp} onClose={handleCloseSignUp} onShowLogin={handleShowLoginAfterSignUp} />
            )}
        </div>
    )
}

const Header = ({ handleLogin, handleSignUp }) => {
    return (
        <header style={{ borderBottom: "1px solid #ccc" }}>
            <div
                className="container"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <div
                    className="logo"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Link to="/">
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                height: "60px",
                                width: "70px",
                                marginTop: "20px"
                            }}
                        />
                    </Link>
                    <p
                        style={{
                            fontWeight: "bold",
                            fontSize: "20px",
                            margin: "0"
                        }}
                    >
                        BEST SCHOOL
                    </p>
                    <p className="text-muted" style={{ fontSize: "9px" }}>
                        EDUCATION COMUNITY
                    </p>
                </div>
                <nav style={{ display: "flex", gap: "20px" }}>
                    <a href="#school-search" style={{ textDecoration: "none", color: "#007bff" }}>
                        School Search
                    </a>
                    <a href="#community" style={{ textDecoration: "none", color: "#007bff" }}>
                        Community
                    </a>
                    <a href="#about-us" style={{ textDecoration: "none", color: "#007bff" }}>
                        About Us
                    </a>
                </nav>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button variant="primary" onClick={handleLogin}>
                        Login
                    </Button>
                    <Button variant="primary" onClick={handleSignUp}>
                        Sign Up
                    </Button>
                </div>
            </div>
        </header>
    )
}

const SearchSection = () => {
    const [cities, setCities] = useState([])
    const [districts, setDistricts] = useState([])
    const [selectedCityId, setSelectedCityId] = useState("")
    const [selectedDistrictId, setSelectedDistrictId] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const hostCity = "https://vietnamese-administration.vercel.app/city"
    const hostDistricts = "https://vietnamese-administration.vercel.app/district?cityId="
    const navigate = useNavigate()

    useEffect(() => {
        fetch(hostCity)
            .then((response) => response.json())
            .then((data) => setCities(data))
            .catch((error) => console.error("Error fetching cities:", error))
    }, [])

    useEffect(() => {
        if (selectedCityId) {
            fetch(`${hostDistricts}${selectedCityId}`)
                .then((response) => response.json())
                .then((data) => setDistricts(data))
                .catch((error) => console.error("Error fetching districts:", error))
        } else {
            setDistricts([])
        }
    }, [selectedCityId])

    const handleCityChange = (event) => {
        setSelectedCityId(event.target.value)
        setSelectedDistrictId("")
    }

    const handleDistrictChange = (event) => {
        setSelectedDistrictId(event.target.value)
    }

    const handleSearchKeyChange = (event) => {
        setSearchKey(event.target.value)
    }

    const handleSearch = () => {
        navigate(`/search/${searchKey}/${selectedCityId}/${selectedDistrictId}`)
    }

    return (
        <div className="search-section-div">
            <section id="school-search" className="search-section">
                <div
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        margin: "100px",
                        padding: "20px",
                        borderRadius: "10px"
                    }}
                >
                    <div className="container">
                        <h1>Find the ideal school</h1>
                        <div className="search-box">
                            <h3 className="m-4">Search by school name</h3>
                            <div className="input-group">
                                <input
                                    value={searchKey}
                                    onChange={handleSearchKeyChange}
                                    type="text"
                                    placeholder="Enter a school name"
                                />
                                <button onClick={handleSearch}>Search</button>
                            </div>
                        </div>
                        <h3 className="mt-5">Browse by location</h3>
                        <div className="location-search">
                            <div className="input-group">
                                <select
                                    className="form-select"
                                    onChange={handleCityChange}
                                    value={selectedCityId}
                                    style={{
                                        marginLeft: "48px",
                                        fontSize: "14px"
                                    }}
                                >
                                    <option value="">Province/City</option>
                                    {cities.map((city) => (
                                        <option key={city.cityId} value={city.cityId}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="form-select"
                                    value={selectedDistrictId}
                                    onChange={handleDistrictChange}
                                    disabled={!selectedCityId}
                                    style={{ fontSize: "14px" }}
                                >
                                    <option value="">District</option>
                                    {districts.map((district) => (
                                        <option key={district.districtId} value={district.districtId}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={handleSearch} style={{ marginRight: "48px" }}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <i className="note">
                            NOTE: The inclusion of a school in this search does NOT constitute an endorsement <br />
                            of the school and should NOT be used to infer the accreditation status of the school.
                        </i>
                    </div>
                </div>
            </section>
        </div>
    )
}

const Testimonials = ({ feedbackTop }) => (
    <section className="testimonials">
        <div className="container">
            <h1 className="mb-5" style={{ textAlign: "center" }}>
                Our Testimonials
            </h1>
            <div className="testimonial-wrapper">
                {feedbackTop.length > 0 ? (
                    feedbackTop.map((item, index) => (
                        <div className="testimonial" key={index}>
                            <Col style={{ width: "130px", maxWidth: "160px" }}>
                                <img src={item.avatar} alt={item.name} />
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <h5>{item.name}</h5>{" "}
                                    </Col>
                                    <Col style={{ textAlign: "right" }}>
                                        <Rating
                                            style={{ fontSize: "20px" }}
                                            name="half-rating-read"
                                            defaultValue={item.averageCriteriaValue}
                                            precision={0.5}
                                            readOnly
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <p>{item.content}</p>
                                </Row>
                            </Col>
                        </div>
                    ))
                ) : (
                    <p>No testimonials available.</p>
                )}
            </div>
        </div>
    </section>
)

const AboutUs = () => (
    <section id="about-us" className="about-us">
        <div className="container">
            <h1 className="mb-5">About Us</h1>
            <div className="about-grid">
                <div className="about-box">
                    <MdOutlineMapsHomeWork />
                    <h3>Our School Networks</h3>
                    <p style={{ fontSize: "24px" }}>
                        800+ <br />
                        Preschools and Kindergarten
                    </p>
                    <p>
                        Search for a preschool for your child based on basic criteria such as: quality, reviews of other
                        parents, location, tuition fees, ...
                    </p>
                </div>
                <div className="about-box">
                    <IoLocationOutline />
                    <h3>Parent Community</h3>
                    <p style={{ fontSize: "24px" }}>
                        1500+ <br />
                        School profiles of parents and kids
                    </p>
                    <p>
                        Close connection with to parents through multiple channels including email, chat and phone
                        calls. Get feedback from parents to provide a comprehensive view
                    </p>
                </div>
                <div className="about-box">
                    <GrUserManager />
                    <h3>Special Consultations</h3>
                    <p style={{ fontSize: "24px" }}>
                        30+ <br />
                        Consultants with 5-10 yrs of experience in education
                    </p>
                    <p>
                        Our consultant with deep knowledge on pre-school education will help parents to choose the right
                        school for their children
                    </p>
                </div>
            </div>
        </div>
    </section>
)

const VisitUs = () => (
    <section className="visit-us">
        <div className="container">
            <div className="visit-us-content">
                <div className="visit-us-info">
                    <h2 className="mb-4">COME VISIT US</h2>
                    <p style={{ fontSize: "18px" }}>
                        21TH FL, EDUCATION TOWER,
                        <br />
                        BACH MAI WARD, HAI BA TRUNG DIST, HANOI
                    </p>
                    <hr style={{ width: "35%", margin: "35px auto" }} />
                </div>
                <div className="visit-us-partners">
                    <h2>OUR PARTNERS</h2>
                    <div className="partners-logos">
                        <div className="partner">
                            <a href="link-to-ministry-of-education">
                                <MdOutlineCastForEducation className="icon" />
                                <p>Ministry of Education</p>
                            </a>
                        </div>
                        <div className="partner">
                            <a href="link-to-education-news">
                                <FaRegNewspaper className="icon" />
                                <p>Education News</p>
                            </a>
                        </div>
                        <div className="partner">
                            <a href="link-to-kids-center">
                                <AiOutlineDiscord className="icon" />
                                <p>Kids Center</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
)

export default Landing
