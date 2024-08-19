// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
// import { FaChevronLeft, FaChevronRight, FaCircle } from 'react-icons/fa';
// import anhnen1 from '../src/assets/images/anhnen.jpg';
// import anhnen2 from '../src/assets/images/0106_hinh-nen-4k-may-tinh24.jpg';
// import anhnen3 from '../src/assets/images/Hinh-nen-Desktop-dep-2.jpg';
// import anhnen4 from '../src/assets/images/hinh-nen-4k-laptop-va-pc-toi-gian-800x500.jpg';
// import anhnen5 from '../src/assets/images/hinh-nen-may-tinh.jpg';
// import anhnen6 from '../src/assets/images/wallhaven-8586my.png';
// import anhnen7 from '../src/assets/images/wallhaven-p95x7m.png';
// import 'bootstrap/dist/css/bootstrap.min.css';

// function Test() {
//   const images = [anhnen1, anhnen2, anhnen3, anhnen4, anhnen5, anhnen6, anhnen7];
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
//   };

//   const handleSelect = (selectedIndex) => {
//     setCurrentIndex(selectedIndex);
//   };

//   useEffect(() => {
//     const interval = setInterval(nextSlide, 5000); // Chuyển slide mỗi 3 giây
//     return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
//   }, [currentIndex]); // Chạy lại useEffect khi currentIndex thay đổi

//   return (
//     <Container fluid className="p-0 position-relative">
//       <div className="carousel slide carousel-fade">
//         <Carousel
//           fade
//           activeIndex={currentIndex}
//           onSelect={handleSelect}
//           interval={null} // Tắt tự động chuyển slide của Carousel
//           controls={false} // Tắt các nút điều khiển
//           style={{ marginBottom: '20px' }}
//         >
//           {images.map((image, index) => (
//             <Carousel.Item key={index}>
//               <img
//                 src={image}
//                 className="d-block w-100"
//                 alt={`Slide ${index}`}
//                 style={{ height: '65vh', objectFit: 'cover' }}
//               />
//             </Carousel.Item>
//           ))}
//         </Carousel>

//         <Row className="justify-content-center align-items-center">
//           <Col xs={4} className="d-flex justify-content-center align-items-center" style={{ height: '30vh' }}>
//             <img
//               src={images[(currentIndex - 1 + images.length) % images.length]}
//               className="img-fluid"
//               alt="Previous Image"
//               style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '10px' }}
//               onClick={prevSlide}
//             />
//           </Col>
//           <Col xs={4} className="d-flex justify-content-center align-items-center" style={{ height: '30vh' }}>
//             <img
//               src={images[currentIndex]}
//               className="img-fluid"
//               alt="Current Image"
//               style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '10px' }}
//             />
//           </Col>
//           <Col xs={4} className="d-flex justify-content-center align-items-center" style={{ height: '30vh' }}>
//             <img
//               src={images[(currentIndex + 1) % images.length]}
//               className="img-fluid"
//               alt="Next Image"
//               style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '10px' }}
//               onClick={nextSlide}
//             />
//           </Col>
//         </Row>

//         <div className="d-flex justify-content-center align-items-center mt-3">
//           <Button variant="link" onClick={prevSlide}>
//             <FaChevronLeft size={24} color="black" />
//           </Button>
//           <div className="mx-3">
//             {images.map((_, index) => (
//               <Button
//                 key={index}
//                 variant="link"
//                 className={`p-0 mx-1 ${index === currentIndex ? 'active' : ''}`}
//                 onClick={() => setCurrentIndex(index)}
//               >
//                 <FaCircle size={12} color={index === currentIndex ? 'blue' : 'gray'} />
//               </Button>
//             ))}
//           </div>
//           <Button variant="link" onClick={nextSlide}>
//             <FaChevronRight size={24} color="black" />
//           </Button>
//         </div>
//       </div>
//     </Container>
//   );
// }

// export default Test;
