import React, { useEffect, useState } from "react"
import { Modal, Button } from "antd"
import StarRating from "../common/StarRating"
import "../../assets/scss/RatingSchoolByUser.scss"
import SchoolApi from "../../api/SchoolApi"

function RatingSchoolByUser({ visible, onClose, schoolId }) {
  const [ratingFeature, setRatingFeature] = useState([]);
  const [ratings, setRatings] = useState({});
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [enRollError, setEnRollError] = useState("");
  const [ratingError, setRatingError] = useState("");

  useEffect(() => {
    const fetchRatingFeature = async () => {
      try {
        const ratings = await SchoolApi.getRatingFix();
        const initialRatings = ratings.data.ratings.reduce(
          (acc, { criteriaId }) => {
            acc[criteriaId] = 0;
            return acc;
          },
          {}
        );
        setRatings(initialRatings);
        setRatingFeature(ratings.data.ratings);
      } catch (error) {
        console.error("Error fetching school detail:", error);
      }
    };
    fetchRatingFeature();
  }, []);

    const handleRatingChange = (criteriaId, value) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [criteriaId]: value
        }))
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      schoolId,
      content: feedback,
      ratings: Object.entries(ratings)
        .filter(([criteriaId, value]) => value >= 1)
        .map(([criteriaId, value]) => ({
          criteriaId: parseInt(criteriaId),
          value: value,
        })),
    };
    
    setFeedbackError("");
    setEnRollError("");
    try {
      await SchoolApi.ratingSchoolByUser(data);
      alert("Rating successful!");
      onClose();
    } catch (error) {
      setFeedbackError(error.response.data.exception.content);
      setEnRollError(error.response.data.exception.schoolId);
      if(error.response.data.exception.content){
        setFeedbackError("Please enter feedback detail.")
      }
      if (enRollError?.length > 0) {
        alert(enRollError);
        setFeedbackError("");
      }
    }
  };

    const handleCancel = () => {
        setRatings(
            ratingFeature.reduce((acc, { criteriaId }) => {
                acc[criteriaId] = 0
                return acc
            }, {})
        )
        setFeedback("")
        setFeedbackError("");
        setEnRollError("");
        onClose()
    }

    return (
        <Modal
            visible={visible}
            onCancel={handleCancel}
            footer={null}
            title={<h4 style={{ textAlign: "center" }}>Please leave your ratings</h4>}
        >
            <div className="rating-form">
                <p style={{ textAlign: "center" }}>Please give specific ratings for the following criteria</p>

                {ratingFeature.map(({ criteriaId, criteriaName }) => (
                    <div key={criteriaId} className="rating-item">
                        <label>{criteriaName}:</label>
                        <StarRating
                            allowHalf
                            value={ratings[criteriaId] >= 1 ? ratings[criteriaId] : 0}
                            onChange={(newValue) => handleRatingChange(criteriaId, newValue)}
                        />
                    </div>
                ))}
              {ratingError && <p style={{ color: "red" }}>{ratingError}</p>}
        <div className="feedback-section">
          <label>Feedback:</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback here"
          />
          {feedbackError && <p style={{ color: "red" }}>{feedbackError}</p>}
        </div>

                <div className="form-actions" style={{justifyContent:'space-around'}}>
                    <Button style={{height:'45px'}} className="cancel-btn" onClick={handleCancel}>Cancel</Button>
                    <Button style={{height:'45px'}}  className="submit-btn" type="primary" onClick={(e) => handleSubmit(e)}>
                        Submit
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default RatingSchoolByUser
