import { useEffect, useState } from "react"
import Request from "../../api/RequestApi"
import { Col, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAddressBook, faBitcoinSign, faEarthAmericas, faLocationDot } from "@fortawesome/free-solid-svg-icons"
import PaggingComponent from "../common/PaggingComponent"
import { Stack, Alert, Rating, Button } from "@mui/material"
import Breadcrumbs from "../common/Breadcrumbs"

function ViewMyRequest() {
    const [requestData, setRequestData] = useState([])
    const [numberOfOpenRequest, setNumberOfOpenRequest] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [resultsFound, setResultsFound] = useState(true)
    const [expandedRequest, setExpandedRequest] = useState({})
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
    useEffect(() => {
        async function fetchRequestData(pageNo) {
            const requestsData = await Request.viewMyRequest(pageNo, 10)

            let formattedRequestData = []
            if (requestsData.item !== "No results found.") {
                formattedRequestData = requestsData.item.map((request) => ({
                    ...request
                }))
            }

            setNumberOfOpenRequest(requestsData.openElement)

            setRequestData(formattedRequestData || [])
            setCurrentPage(requestsData.pageNo)
            setTotalPage(requestsData.totalPage)
            setResultsFound(formattedRequestData.length !== 0)
        }
        fetchRequestData(currentPage)
    }, [currentPage])

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const toggleExpandRequest = (id) => {
        setExpandedRequest((prevState) => ({
            ...prevState,
            [id]: !prevState[id]
        }))
    }

    return (
        <div style={{ marginLeft: "60px", marginRight: "60px" }}>
            <div>
                <Row style={{ margin: '20px 0px 30px -20px' }}>
                    <Breadcrumbs />
                </Row>
                <div style={{ marginBottom: "20px" }}>
                    <h2 style={{ marginBottom: "40px" }}>My Requests</h2>
                    <h5>You have {numberOfOpenRequest} open requests</h5>
                </div>
                <div>
                    {requestData.map((request) => (
                        <Row key={request.requestId} style={{ marginBottom: "20px" }}>
                            <Col md={7}>
                                <div className="school-card">
                                    <div className="school-info">
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            <div
                                                className="request-link"
                                                style={{
                                                    color: "#007bff",
                                                    textDecoration: "underline",
                                                    fontSize: "18px"
                                                }}
                                            >
                                                Request Number: #{request.requestId}
                                            </div>
                                            <div> {new Date(request.requestDate).toLocaleString()}</div>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}
                                        >
                                            <div
                                                className="request-link"
                                                style={{
                                                    color: "#007bff",
                                                    textDecoration: "underline",
                                                    fontSize: "18px"
                                                }}
                                            >
                                                Request Infomation:
                                            </div>

                                            <div
                                                style={
                                                    request.status === "Open"
                                                        ? {
                                                            backgroundColor: "#75D97F",
                                                            color: "white",
                                                            borderRadius: "10px",
                                                            padding: "5px 45px"
                                                        }
                                                        : {
                                                            backgroundColor: "#F7F7F9",
                                                            color: "#6F727A",
                                                            border: "2px solid #E3E5E8",
                                                            borderRadius: "10px",
                                                            padding: "5px 45px"
                                                        }
                                                }
                                            >
                                                {request.status}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: "10px" }}>Full Name: {request.fullName}</div>

                                        <div style={{ marginBottom: "10px" }}>Email address: {request.email}</div>

                                        <div style={{ marginBottom: "10px" }}>Phone Number: {request.phone}</div>

                                        <div>
                                            Inquiry:
                                            <div>
                                                {expandedRequest[request.requestId] ? (
                                                    <>
                                                        {request.question}
                                                        <Button
                                                            size="small"
                                                            style={{
                                                                textTransform: "none",
                                                                textDecoration: "underline"
                                                            }}
                                                            onClick={() => toggleExpandRequest(request.requestId)}
                                                        >
                                                            See less
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {request.question.substring(0, 100)}.
                                                        <Button
                                                            size="small"
                                                            style={{
                                                                textTransform: "none",
                                                                textDecoration: "underline"
                                                            }}
                                                            onClick={() => toggleExpandRequest(request.requestId)}
                                                        >
                                                            See more...
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                color: "#a9a9a9",
                                                fontSize: "15px",
                                                fontStyle: "italic"
                                            }}
                                        >
                                            Our staff will contact with you within 24 hrs. If you need urgent
                                            assistance, please contact us via our hotline{" "}
                                            <span
                                                style={{
                                                    color: "#007bff",
                                                    textDecoration: "underline",
                                                    fontWeight: "normal"
                                                }}
                                            >
                                                09123456888
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={5}>
                                <div className="school-card">
                                    <div className="school-info">
                                        <div
                                            style={{
                                                color: "#18A0FB",
                                                fontSize: "18px"
                                            }}
                                        >
                                            School Summary
                                        </div>
                                        <div
                                            className="request-link"
                                            style={{
                                                color: "#18A0FB",
                                                textDecoration: "underline",
                                                fontSize: "30px",
                                                fontWeight: "700",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            {request.school.name}
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faLocationDot}
                                                style={{
                                                    marginRight: "10px",
                                                    color: "#6c757d"
                                                }}
                                            />
                                            <span>
                                                Address: {request.school.addressLine}, {request.school.ward},{" "}
                                                {request.school.district}, {request.school.city}
                                            </span>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faEarthAmericas}
                                                style={{
                                                    marginRight: "10px",
                                                    color: "#6c757d"
                                                }}
                                            />
                                            <span>
                                                Website:{" "}
                                                <a href={request.school.website} style={{ color: "#007bff" }}>
                                                    {request.school.website}
                                                </a>
                                            </span>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faBitcoinSign}
                                                style={{
                                                    marginRight: "10px",
                                                    color: "#6c757d"
                                                }}
                                            />


                                            <span>Tuition fee: From {formatNumber(request.school.feeFrom)} VND/ month</span>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faAddressBook}
                                                style={{
                                                    marginRight: "10px",
                                                    color: "#6c757d"
                                                }}
                                            />
                                            <span>Admission age: {formatDuration(request.school.schoolAge.rangeAge)}</span>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center"
                                            }}
                                        >
                                            <Rating
                                                name="half-rating-read"
                                                defaultValue={request.school.averageRating}
                                                precision={0.1}
                                                readOnly
                                                style={{ marginRight: "10px" }}
                                            />
                                            <span>
                                                {request.school.averageRating}/5 ({request.school.totalRating} ratings)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    ))}
                </div>

                {resultsFound ? (
                    <div style={{ margin: "20px 0px" }}>
                        <PaggingComponent count={totalPage} currentPage={currentPage} onPageChange={handlePageChange} />
                    </div>
                ) : (
                    <Stack spacing={2} style={{ marginTop: "20px" }}>
                        <Alert severity="info">No results found.</Alert>
                    </Stack>
                )}
            </div>
        </div>
    )
}

export default ViewMyRequest
