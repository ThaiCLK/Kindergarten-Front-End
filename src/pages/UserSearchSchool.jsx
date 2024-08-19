import React, { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import SearchSchoolByUserComponent from "../components/common/SearchSchoolByUserComponent"
import FilterSchoolSideBar from "../components/common/FilterSchoolSideBar"
import { Button, Form, Input, Select } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAddressBook,
  faBitcoinSign,
  faEarthAmericas,
  faLightbulb,
  faLocationDot,
  faSchoolFlag,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import schoolAPI from "../api/SchoolApi";
import PaggingComponent from "../components/common/PaggingComponent";
import { Rating } from "@mui/material";
import CounselingForm from "../components/common/CounselingForm";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../components/common/Breadcrumbs";
import "../assets/scss/3-components/_userSearchSchool.scss";
import Login from "../components/auth/LoginGuest";
import SignUp from "../components/auth/SignUp";
import anhDef from "../assets/img/anhDef.jpg"
import { isFulfilled } from "@reduxjs/toolkit"
function useQuery() {
  return new URLSearchParams(useLocation().search)
}
const { Option } = Select

function UserSearchSchool() {
  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US").format(number);
  };
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filters, setFilters] = useState({
    schoolType: 1,
    schoolAge: 1,
    feeRange: [1000000, 20000000],
    facilities: [],
    utilities: []
  });
  const [searchKeySchool, setSearchKeySchool] = useState("");
  const [schoolList, setSchoolList] = useState([]);
  const hostCity = "https://vietnamese-administration.vercel.app/city";
  const hostDistricts =
    "https://vietnamese-administration.vercel.app/district?cityId=";
  const query = useQuery();
  const searchKey = query.get("searchKey");
  const selectedCityId = query.get("selectedCityId");
  const selectedDistrictId = query.get("selectedDistrictId");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [filterBy, setFilterBy] = useState("rating");
  const [isModalVisible, setIsModalVisible] = useState(null);
  const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [totalSchool, setTotalSchool] = useState(0);
  const [schoolIdAfterLogin, setSchoolIdAfterLogin] = useState(-1);
  const navigate = useNavigate()
  // Xử lý search từ home
  useEffect(() => {
    const fetchCitiesAndDistricts = async () => {
      try {
        const cityResponse = await fetch(hostCity);
        const dataCities = await cityResponse.json();
        setCities(dataCities);

        if (selectedCityId) {
          const districtResponse = await fetch(
            `${hostDistricts}${selectedCityId}`
          );
          const dataDis = await districtResponse.json();
          setDistricts(dataDis);

          const city = dataCities.find(
            (city) => city.cityId === selectedCityId
          );
          const district = dataDis.find(
            (dis) => dis.districtId === selectedDistrictId
          );
          if (city != null || district != null) {
            setSelectedCity(city ? city.name : "");
            setSelectedDistrict(district ? district.name : "");
          }

        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCitiesAndDistricts();
    if (searchKey) {
      console.log("vao r", searchKey);
      
      setSearchKeySchool(searchKey || "");
    }
  }, [searchKey, selectedCityId, selectedDistrictId]);
  // load Cities
  useEffect(() => {
    fetch(hostCity)
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);
  // load District
  useEffect(() => {
    if (selectedCity) {
      const cityId = cities.find((city) => city.name === selectedCity)?.cityId;
      fetch(`${hostDistricts}${cityId}`)
        .then((response) => response.json())
        .then((data) => setDistricts(data))
        .catch((error) => console.error("Error fetching districts:", error));
    } else {
      setDistricts([]);
    }
  }, [selectedCity, cities]);

  const handleCityChange = (value) => {
    setSelectedCity(value)
    setSelectedDistrict("")
  }

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value)
  }

  const handleSearchKeyChange = (event) => {
    setSearchKeySchool(event.target.value)
  }
  const showModal = (schoolId) => {
    setIsModalVisible(schoolId);
  }

  const handleClose = () => {
    setIsModalVisible(null);
  };

  const fetchSchoolByeSearch = async (
    pageNum,
    size,
    sortBy,
    filters,
    searchKeySchool,
    district,
    city
  ) => {
    const { schoolAge, schoolType, feeRange, facilities, utilities } = filters;
    const feeFrom = feeRange ? feeRange[0] : null;
    const feeTo = feeRange ? feeRange[1] : null;

    try {
      const response = await schoolAPI.getSchoolByFilter(
        pageNum,
        size,
        sortBy,
        schoolAge || "",
        schoolType || "",
        feeFrom || "",
        feeTo || "",
        facilities?.join(",") || "",
        utilities?.join(",") || "",
        searchKeySchool,
        district,
        city
      )

      setSchoolList(response.data.item || [])
      setPageSize(response.data.pageSize)
      setTotalPage(response.data.totalPage)
      setTotalSchool(response.data.totalElement)
      setPageNo(response.data.pageNo)
    } catch (error) {
      console.error("Error fetching school data:", error)
    }
  }
  // };
  const formatDuration = (input) => {
    return input
      .replace(/(\d+)m/g, "$1 month")
      .replace(/(\d+)y/g, "$1 year")
      .replace(/(\d+) month/, "$1 months")
      .replace(/(\d+) year/, "$1 years")
      .replace("-", " to ")
      .replace(/^/, "From ");
  };

  useEffect(() => {
    if (pageNo != 1) {
      setPageNo(1);
    } else {
      fetchSchoolByeSearch(
        1,
        pageSize,
        filterBy,
        filters,
        searchKeySchool,
        selectedDistrict,
        selectedCity
      );
    }
  }, [filters]);

  useEffect(() => {
    fetchSchoolByeSearch(
      pageNo,
      pageSize,
      filterBy,
      filters,
      searchKeySchool,
      selectedDistrict,
      selectedCity
    );
  }, [pageNo, filterBy]);

  const handlePageChange = (pageNumber) => {
    setPageNo(pageNumber)
  }

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => {
      if (JSON.stringify(prevFilters) !== JSON.stringify(newFilters)) {
        return newFilters;
      }
      return prevFilters;
    });
  };


  const handleSignUp = () => {
    setShowSignUp(true);
    setShowLogin(false);

  };

  const handleShowLoginAfterSignUp = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  const handleButtonNotLogin = (schoolId) => {
    localStorage.setItem("keyIdSchool", schoolId);
    setShowLogin(true);
    setSchoolIdAfterLogin(schoolId);
  }
  useEffect(() => {
    const a = localStorage.getItem("isLogOk");
    localStorage.removeItem("keyIdSchool");
    localStorage.removeItem("isLogOk");
    if (a) {
      setIsModalVisible(schoolIdAfterLogin);
    }
  }, [localStorage.getItem("isLogOk")]);

  const handerSearchClick = () => {
    if (searchKeySchool.length <= 0) {
      alert("Please enter school name or select location to search")
    } else {
      fetchSchoolByeSearch(
        pageNo,
        pageSize,
        filterBy,
        filters,
        searchKeySchool,
        selectedDistrict,
        selectedCity
      );
    }

  };

  return (
    <div>
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
      <div
        style={{
          backgroundColor: "#495456",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Input
          placeholder="Enter a school name"
          style={{ width: "45%", height: "37px", borderRadius: "10px 0 0 10px", border: '2px solid #50A5D6' }}
          onChange={handleSearchKeyChange}
          value={searchKeySchool}
        />
        <div id="select">
          <Select
            placeholder="City/Province"
            style={{ width: "200px", height: "37px" }}
            onChange={handleCityChange}
            value={selectedCity ? selectedCity : undefined}
            className="city-district"
          >
            {cities.map((city) => (
              <Option key={city.cityId} value={city.name}>
                {city.name}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="District"
            style={{ width: "200px", height: "37px" }}
            onChange={handleDistrictChange}
            value={selectedDistrict ? selectedDistrict : undefined}
            className="city-district"
          >
            {districts.map((district) => (
              <Option key={district.districtId} value={district.name}>
                {district.name}
              </Option>
            ))}
          </Select>
          <Button className="search-bt" onClick={() => handerSearchClick()} id="searchButton" style={{ border: '2px solid #50A5D6', height: "37px" }}
          >
            Search
          </Button>
        </div>
      </div>
      <Row style={{ margin: '10px 0px 10px 5px' }}>
        <Breadcrumbs />
      </Row>
      <Row style={{ margin: "10px" }}>
        <h6 style={{ textAlign: "center", marginTop: "5px" }}>
          There're {totalSchool} schools that match your search criteria
        </h6>
      </Row>
      <Row style={{ textAlign: "right", marginRight: '20px' }}>
        <Form.Item>
          <Select
            onChange={(value) => setFilterBy(value)}
            style={{ width: "160px", textAlign: "left" }}
            defaultValue="rating"
          >
            <Option value="rating">By rating</Option>
            <Option value="newest">By date</Option>
            <Option value="lowestFee">Fee increase</Option>
            <Option value="highestFee">Fee decrease</Option>
          </Select>
        </Form.Item>
      </Row>

      <Row style={{ margin: '0px 20px' }}>
        <Col style={{ maxWidth: "270px" }}>
          <FilterSchoolSideBar onFilterChange={handleFilterChange} />
        </Col>
        {schoolList != [] ? (
          <Col>
            {schoolList.map((school) => (
              <div className="school-card" key={school.id}>
                <div>
                  <img
                    src={school?.images[0]?.imagePath || anhDef}
                    className="school-image"
                    onClick={() => navigate(`/home/search-school/school-detail/${school.id}`)}
                    style={{cursor:'pointer'}}
                  />
                  <div className="rating" style={{ marginTop: '10px', marginLeft: '15px', display:'flex' }}>
                    <Rating
                      name="half-rating-read"
                      value={school.averageRating}
                      precision={0.5}
                      readOnly
                    />
                    <span className="rating-text">
                      {school?.averageRating}/5.0({school.totalRating} ratings)
                    </span>
                  </div>
                </div>
                <div className="school-info">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h4 style={{ color: '#1A9FFA', fontWeight: '700' }}>
                      <Link
                        to={`/home/search-school/school-detail/${school.id}`}
                      >
                        {school.name}
                      </Link>{" "}
                    </h4>
                    <CounselingForm
                      visible={isModalVisible === school.id}
                      onClose={handleClose}
                      schoolId={school.id}
                    />
                    {storedUserInfo != null ? (
                      <Button onClick={() => showModal(school.id)} className="request-button" style={{ whiteSpace: 'normal', width: '100px', textAlign: 'center', height: '45px' }}>
                        Request Counseling
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleButtonNotLogin(school.id)}
                        className="request-button"
                        style={{ whiteSpace: 'normal', width: '100px', textAlign: 'center', height: '45px' }}
                      >
                        Request Counseling
                      </Button>
                    )}

                  </div>

                  <Row className="info-row">
                    <Col style={{ display: "flex" }} sm={3}>
                      <FontAwesomeIcon className="icon_infor" icon={faLocationDot} />
                      <div className="icon_title" style={{ marginLeft: "5px" }}>
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
                    <Col style={{ display: "flex" }} sm={3}>
                      <FontAwesomeIcon className="icon_infor" icon={faEarthAmericas} />
                      <div className="icon_title" style={{ marginLeft: "5px" }}>
                        Website:
                      </div>
                    </Col>
                    <Col>
                      <a href={""}>ABC.edu.naruto</a>
                    </Col>
                  </Row>

                  <Row className="info-row">
                    <Col style={{ display: "flex" }} sm={3}>
                      <FontAwesomeIcon
                        className="icon_infor"
                        icon={faBitcoinSign}
                      />
                      <div className="icon_title" style={{ marginLeft: "5px" }}>
                        Tuition Fee:
                      </div>
                    </Col>
                    <Col>
                      <span>
                        From {formatNumber(school.feeFrom)} VND/ month
                      </span>
                    </Col>
                  </Row>

                  <Row className="info-row">
                    <Col style={{ display: "flex" }} sm={3}>
                      <FontAwesomeIcon
                        className="icon_infor"
                        icon={faAddressBook}
                      />
                      <div className="icon_title" style={{ marginLeft: "5px" }}>
                        Admission age:
                      </div>
                    </Col>
                    <Col>
                      <span>{formatDuration(school.age.rangeAge)}</span>
                    </Col>
                  </Row>

                  <Row className="info-row">
                    <Col style={{ display: "flex" }} sm={3}>
                      <FontAwesomeIcon
                        className="icon_infor"
                        icon={faSchoolFlag}
                      />
                      <div className="icon_title" style={{ marginLeft: "5px" }}>
                        School Type:
                      </div>
                    </Col>
                    <Col>
                      <span>{school.type.type}</span>
                    </Col>
                  </Row>

                  <Row className="facilities">
                    <Col style={{ display: "flex" }} sm={3}>
                      <FontAwesomeIcon className="icon_infor" icon={faLightbulb} />
                      <div className="icon_title" style={{ marginLeft: "5px" }}>
                        Facilities and Utilities:
                      </div>
                    </Col>
                    <Col>
                      <div className="facility-tags">
                        {school.facilities.map((facility, index) => (
                          <span className="facility-tag" key={index}>
                            {facility.name}
                          </span>
                        ))}
                        {school.utilities.map((utilities, index) => (
                          <span className="facility-tag" key={index}>
                            {utilities.name}
                          </span>
                        ))}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            ))}
          </Col>
        ) : (
          <h4>There is no school that martch!</h4>
        )}
      </Row>
      <div style={{ paddingTop: "20px" }}>
        <PaggingComponent count={totalPage} currentPage={pageNo} onPageChange={handlePageChange} />
      </div>
    </div>
  )
}

export default UserSearchSchool;
