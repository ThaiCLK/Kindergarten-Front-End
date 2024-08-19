import React, { useEffect, useState } from "react"
import "../../assets/scss/Landing.scss"
import "bootstrap/dist/css/bootstrap.css"
import SchoolApi from "../../api/SchoolApi"

const Testimonials = () => {
  const [feedbacks, setFeedbackTop] = useState([])
  const defaultAvatar = "https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await SchoolApi.getSchoolTopFeedback()
        setFeedbackTop(response.data.feedbacks || [])
      } catch (error) {
        console.error("Error fetching required data:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <section className="testimonials">
      <div className="container" style={{ textAlign: "center", marginTop: "20px" }}>
        <h1 className="mb-5">Our testimonials</h1>
        <div className="testimonial-grid">
          {feedbacks.slice(0, 4).map((feedback) => (
            <div className="testimonial" key={feedback.id}>
              <div className="testimonial-header">
                <img src={feedback.avatar || defaultAvatar} alt={feedback.name} />
                <div>
                  <h3>{feedback.name}</h3>
                  <p>{feedback.content}</p>
                </div>
                <div className="stars-hompage">
                  {Array.from({ length: 5 }, (v, i) => (
                    <span key={i} className={i < Math.round(feedback.averageCriteriaValue) ? "star-color filled-color" : "star-color"}>
                      ★
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials
