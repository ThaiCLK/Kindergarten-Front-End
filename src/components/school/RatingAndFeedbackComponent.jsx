import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Card, Row, Col, Form, Button, Container, Image } from "react-bootstrap"
import "../../assets/scss/Test.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsRotate, faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons"
import { Rating } from "@mui/material"
import { Link, useParams } from "react-router-dom"
import { styled } from "@mui/system"
import LayoutComponents from "../../components/common/LayoutComponents"
import SchoolApi from "../../api/SchoolApi"

const RatingAndFeedbackComponent = () => {
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [rating, setRating] = useState({})
    const [averageRating, setAverageRating] = useState(0)
    const [feedback, setFeedback] = useState({})
    const [checkedNumbers, setCheckedNumbers] = useState([])
    const [clickMore, setClickMore] = useState(3)
    const NumberList = [1, 2, 3, 4, 5]
    const { schoolId } = useParams()
    const handleFilter = (event, number) => {
        if (event.target.checked) {
            setCheckedNumbers((prev) => [...prev, number])
        } else {
            setCheckedNumbers((prev) => prev.filter((num) => num !== number))
        }
    }

    const HiddenStars = styled("div")({
        "& .MuiRating-iconEmpty": {
            display: "none"
        }
    })

    const formatDate = (date) => {
        return date instanceof Date ? date.toISOString().slice(0, 10) : date?.toString().slice(0, 10) || ""
    }

    useEffect(() => {
        async function fetchSchoolsRating(startDate, endDate, schoolId) {
            const RatingData = await SchoolApi.getRatingByDate(startDate, endDate, schoolId)
            setRating(RatingData || [])
        }
        fetchSchoolsRating(formatDate(startDate), formatDate(endDate), schoolId)
    }, [startDate, endDate])

    useEffect(() => {
        async function fetchSchoolsFeedback(startDate, endDate, schoolId, checkedNumbers, limit) {
            const FeedbackData = await SchoolApi.getFeedbackByDate(
                startDate,
                endDate,
                schoolId,
                checkedNumbers.length === 0 ? NumberList : checkedNumbers,
                limit
            )

            setFeedback(FeedbackData || [])
        }
        fetchSchoolsFeedback(formatDate(startDate), formatDate(endDate), schoolId, checkedNumbers, clickMore)
    }, [startDate, endDate, checkedNumbers, clickMore])

    useEffect(() => {
        if (rating.ratings && rating.ratings.length > 0) {
            const total = rating.ratings.reduce((acc, rate) => acc + rate.averageRatingValue, 0)
            const avg = total / rating.ratings.length
            setAverageRating(avg)
        } else {
            setAverageRating(0)
        }
    }, [rating])

    function handleViewMore() {
        setClickMore(feedback.totalFeedback)
    }

    return (
        <LayoutComponents title={"Rating And Feedback"}>
            <Container className="container ratings-feedbacks" style={{ padding: "5px 70px" }}>
                <Row
                    className="date-picker-row"
                    style={{
                        marginBottom: "250px",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Col>
                        <Form.Group controlId="formStartDate">
                            <Form.Label style={{ marginRight: "50px" }}>
                                <h4>From</h4>
                            </Form.Label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="form-control date-picker"
                                dateFormat="dd/MM/yyyy"
                                isClearable
                                placeholderText="Select start date"
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formEndDate">
                            <Form.Label style={{ marginRight: "50px" }}>
                                <h4>To</h4>
                            </Form.Label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                className="form-control date-picker"
                                dateFormat="dd/MM/yyyy"
                                isClearable
                                placeholderText="Select end date"
                            />
                        </Form.Group>
                    </Col>
                    <Col className="d-flex align-items-end" style={{ width: "120px" }}>
                        <FontAwesomeIcon style={{ fontSize: "36px" }} icon={faArrowsRotate} />
                        <Button
                            style={{
                                backgroundColor: "white",
                                color: "black",
                                border: "none"
                            }}
                            onClick={() => {
                                setStartDate(null)
                                setEndDate(null)
                            }}
                        >
                            Refresh
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Link style={{ color: "black" }} to="">
                        <h4 style={{ color: "black" }}>Ratings</h4>
                    </Link>
                </Row>
                <Row className="mt-4 ratings-section">
                    <Col sm="5">
                        {rating.ratings && rating.ratings.length > 0 ? (
                            <div>
                                {rating.ratings.map((item, key) => (
                                    <Row className="rating-item" key={key}>
                                        <Col>
                                            <p>{item.criteriaName}</p>
                                        </Col>
                                        <Col>
                                            <Rating
                                                style={{ fontSize: "25px" }}
                                                name="half-rating-read"
                                                defaultValue={item.averageRatingValue}
                                                precision={0.5}
                                                readOnly
                                            />
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
                    <Col sm="3">
                        <Card style={{ height: "150px" }} className="average-rating-card">
                            <Container>
                                <Card.Title style={{ marginTop: "10px" }}>Average Rating</Card.Title>
                                <Card.Body
                                    style={{
                                        justifyContent: "center",
                                        textAlign: "center",
                                        marginTop: "20px"
                                    }}
                                >
                                    <Rating name="half-rating-read" value={averageRating} precision={0.5} readOnly />
                                </Card.Body>
                            </Container>
                        </Card>
                    </Col>
                    <Col sm="3">
                        <Card style={{ height: "150px" }} className="feedback-count-card">
                            <Container>
                                <Card.Title style={{ marginTop: "10px" }}>No.of feedback</Card.Title>
                                <Card.Body
                                    style={{
                                        justifyContent: "center",
                                        textAlign: "center",
                                        marginTop: "20px"
                                    }}
                                >
                                    <h5>{feedback?.totalFeedback}</h5>
                                </Card.Body>
                            </Container>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-4 feedbacks-section">
                    <Col>
                        <Link style={{ color: "black" }} to="">
                            <h4 style={{ color: "black" }}>All feedbacks</h4>
                        </Link>
                        <Container style={{ marginLeft: "80px" }}>
                            {feedback.feedbacks?.map((feedback) => (
                                <Row key={feedback.id} className="my-3">
                                    <Col xs={2}>
                                        <Image
                                            style={{
                                                margin: "auto",
                                                width: "50px",
                                                height: "50px"
                                            }}
                                            src={feedback.avatar}
                                            roundedCircle
                                        />
                                    </Col>
                                    <Col xs={9}>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center"
                                            }}
                                        >
                                            <h5 style={{ marginRight: "20px" }}>{feedback.name}</h5>
                                            {feedback.createDate && <small>{formatDate(feedback.createDate)}</small>}
                                        </div>

                                        <div>
                                            <Rating
                                                style={{ fontSize: "15px" }}
                                                name="half-rating-read"
                                                defaultValue={feedback.averageCriteriaValue}
                                                precision={0.5}
                                                readOnly
                                            />
                                        </div>
                                        <p>{feedback.content}</p>
                                    </Col>
                                </Row>
                            ))}
                        </Container>
                    </Col>
                    <Col>
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <FontAwesomeIcon style={{ fontSize: "20px" }} icon={faArrowUpWideShort} />
                                <h4>Filters</h4>
                            </div>
                            <Card
                                style={{
                                    width: "250px",
                                    marginLeft: "180px",
                                    padding: "10px"
                                }}
                                className="feedback-count-card"
                            >
                                {NumberList.map((num) => (
                                    <Form.Check
                                        key={num}
                                        type="checkbox"
                                        checked={checkedNumbers.includes(num)}
                                        onChange={(event) => handleFilter(event, num)}
                                        label={
                                            <HiddenStars>
                                                <Rating name="half-rating-read" defaultValue={num} readOnly />
                                            </HiddenStars>
                                        }
                                    />
                                ))}
                                <Button onClick={() => setCheckedNumbers([])} variant="link" className="reset-button">
                                    Reset
                                </Button>
                            </Card>
                        </div>
                    </Col>
                </Row>
                {clickMore == "0" ? (
                    <Row className="mt-4">
                        <Col style={{ textAlign: "center" }}>
                            <Button onClick={() => handleViewMore()} to="">
                                View more feedbacks...
                            </Button>
                        </Col>
                    </Row>
                ) : (
                    <Row className="mt-4">
                        <Col style={{ textAlign: "center" }}>
                            <Button onClick={() => handleViewMore()} to="">
                                View more feedbacks...
                            </Button>
                        </Col>
                    </Row>
                )}
            </Container>
        </LayoutComponents>
    )
}

export default RatingAndFeedbackComponent
