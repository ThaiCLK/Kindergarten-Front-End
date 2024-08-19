import React, { useState, useEffect } from "react"
import { Rate } from "antd"
import "antd/dist/reset.css" // Import Ant Design CSS
import "../../assets/scss/Star.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightLong } from "@fortawesome/free-solid-svg-icons"

const StarRating = ({ allowHalf = false, value = 0, onChange }) => {
    const [rating, setRating] = useState(value)

    useEffect(() => {
        // Reset rating mỗi khi component render lại hoặc giá trị value thay đổi
        setRating(value)
    }, [value])

    const handleChange = (newValue) => {
        if(newValue >=1 ){
           setRating(newValue)
        if (onChange) {
            onChange(newValue)
        } 
        }
        
    }

    return (
        <div style={{ display: "flex" }}>
            <div className="star-rating">
                {value > 0 ? (
                    <span className="rating-value">{value.toFixed(1)}</span>
                ) : (
                    <div className="pull-button">
                        <FontAwesomeIcon icon={faRightLong} />
                    </div>
                )}
            </div>
            <Rate allowHalf={allowHalf} className="star-rating" size={24} value={rating} onChange={handleChange} />
        </div>
    )
}

export default StarRating
