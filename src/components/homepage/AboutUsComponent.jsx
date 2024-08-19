import React from "react"
import "../../assets/scss/Landing.scss"
import "bootstrap/dist/css/bootstrap.css"
import { MdOutlineMapsHomeWork } from "react-icons/md"
import { IoLocationOutline } from "react-icons/io5"
import { GrUserManager } from "react-icons/gr"

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

export default AboutUs
