import React, { useState, useCallback } from "react"
import { Container, Row, Col, Button } from "react-bootstrap"
import Carousel from "react-bootstrap/Carousel"
import { FaChevronLeft, FaChevronRight, FaCircle } from "react-icons/fa"

const CarouselComponent = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const changeSlide = useCallback(
        (newIndex) => {
            setCurrentIndex((newIndex + images.length) % images.length)
        },
        [images.length]
    )

    const nextSlide = useCallback(() => changeSlide(currentIndex + 1), [changeSlide, currentIndex])
    const prevSlide = useCallback(() => changeSlide(currentIndex - 1), [changeSlide, currentIndex])

    const handleSelect = useCallback((selectedIndex) => {
        setCurrentIndex(selectedIndex)
    }, [])

    const renderImage = useCallback(
        (index, onClick = null, isActive = false) => (
            <Col xs={4} className="d-flex justify-content-center align-items-center" style={{ height: "30vh" }}>
                <img
                    src={images[index]?.imagePath}
                    className="img-fluid"
                    alt={`Image ${index}`}
                    style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                        cursor: onClick ? "pointer" : "default",
                        border: isActive ? "3px solid #007bff" : "none",
                        boxShadow: isActive ? "0 0 10px rgba(0, 123, 255, 0.5)" : "none"
                    }}
                    onClick={onClick}
                />
            </Col>
        ),
        [images]
    )

    return (
        <Container fluid className="p-0 position-relative">
            <div className="carousel slide carousel-fade">
                <Carousel
                    fade
                    activeIndex={currentIndex}
                    onSelect={handleSelect}
                    interval={null}
                    controls={false}
                    style={{ marginBottom: "20px" }}
                >
                    {images.map((image, index) => (
                        <Carousel.Item key={index}>
                            <img
                                src={image?.imagePath}
                                className="d-block w-100"
                                alt={`Slide ${index}`}
                                style={{
                                    height: "65vh",
                                    objectFit: "cover",
                                    borderRadius: "10px"
                                }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>

                <Row className="justify-content-center align-items-center">
                    {renderImage(currentIndex, null, true)} {/* Removed click function, kept active styling */}
                    {renderImage((currentIndex + 1) % images.length, () => changeSlide(currentIndex + 1))}
                    {renderImage((currentIndex + 2) % images.length, () => changeSlide(currentIndex + 2))}
                </Row>

                <div className="d-flex justify-content-center align-items-center mt-1 mb-2">
                    <Button variant="link" onClick={prevSlide}>
                        <FaChevronLeft size={24} color="black" />
                    </Button>
                    <div className="mx-3">
                        {images.map((_, index) => (
                            <Button
                                key={index}
                                variant="link"
                                className={`p-0 mx-1 ${index === currentIndex ? "active" : ""}`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <FaCircle size={12} color={index === currentIndex ? "blue" : "gray"} />
                            </Button>
                        ))}
                    </div>
                    <Button variant="link" onClick={nextSlide}>
                        <FaChevronRight size={24} color="black" />
                    </Button>
                </div>
            </div>
        </Container>
    )
}

export default CarouselComponent
