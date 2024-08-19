import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../../assets/scss/Landing.scss"
import "bootstrap/dist/css/bootstrap.css"

const SearchSection = () => {
    const [cities, setCities] = useState([])
    const [districts, setDistricts] = useState([])
    const [selectedCityId, setSelectedCityId] = useState(null)
    const [selectedDistrictId, setSelectedDistrictId] = useState(null)
    const [searchKey, setSearchKey] = useState("")
    const navigate = useNavigate()
    const hostCity = "https://vietnamese-administration.vercel.app/city"
    const hostDistricts = "https://vietnamese-administration.vercel.app/district?cityId="

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
        setSelectedDistrictId(null)
    }

    const handleDistrictChange = (event) => {
        setSelectedDistrictId(event.target.value)
    }

    const handleSearchKeyChange = (event) => {
        setSearchKey(event.target.value)
    }

    const handleSearch = () => {
        const cityId = selectedCityId || "defaultCity"
        const districtId = selectedDistrictId || "defaultDistrict"
        const key = searchKey.trim()
        navigate(`/home/search-school?searchKey=${key}&selectedCityId=${cityId}&selectedDistrictId=${districtId}`)
    }

    return (
        <div className="search-section-div">
            <section id="school-search" className="search-section">
                <div
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        margin: "100px",
                        padding: "25px",
                        borderRadius: "10px"
                    }}
                >
                    <div className="container" style={{ marginBottom: "15px" }}>
                        <div className="search-box">
                            <h2 style={{ fontSize: "35px", marginBottom: "35px" }}>Find the ideal school</h2>
                            <h3 className="m-4">Search by school name</h3>
                            <div className="input-group">
                                <input
                                    style={{ width: "400px", height: "50px" }}
                                    type="text"
                                    placeholder="Enter a school name"
                                    value={searchKey}
                                    onChange={handleSearchKeyChange}
                                />
                                <button onClick={handleSearch}>Search</button>
                            </div>
                            <h3 style={{ marginBottom: "25px", marginTop: "20px" }}>OR <br />Browse by location</h3>
                            <div className="location-search">
                                <div className="input-group" >
                                    <select
                                        onChange={handleCityChange}
                                        style={{
                                            marginLeft: "48px",
                                            fontSize: "14px",
                                            width: "200px", height: "50px"
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
                                        value={selectedDistrictId || ""}
                                        onChange={handleDistrictChange}
                                        disabled={!selectedCityId}
                                        style={{ fontSize: "14px", width: "200px", height: "50px" }}
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

export default SearchSection
