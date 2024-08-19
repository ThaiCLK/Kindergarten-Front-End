import React from "react"
import "../../assets/scss/Landing.scss"
import "bootstrap/dist/css/bootstrap.css"
import { FaRegNewspaper } from "react-icons/fa"
import { MdOutlineCastForEducation } from "react-icons/md"
import { AiOutlineDiscord } from "react-icons/ai"

const VisitUs = () => (
    <section className="visit-us">
        <div className="container">
            <div className="visit-us-content">
                <div className="visit-us-info">
                    <h2 className="mb-4">COME VISIT US</h2>
                    <p style={{ fontSize: "18px" }}>
                        21TH FL, EDUCATION TOWER,
                        <br />
                        BACH MAI WARD, HAI BA TRUNG DIST, HANOI
                    </p>
                    <hr style={{ width: "35%", margin: "35px auto" }} />
                </div>
                <div className="visit-us-partners">
                    <h2>OUR PARTNERS</h2>
                    <div className="partners-logos">
                        <div className="partner">
                            <a href="link-to-ministry-of-education">
                                <MdOutlineCastForEducation className="icon" />
                                <p>Ministry of Education</p>
                            </a>
                        </div>
                        <div className="partner">
                            <a href="link-to-education-news">
                                <FaRegNewspaper className="icon" />
                                <p>Education News</p>
                            </a>
                        </div>
                        <div className="partner">
                            <a href="link-to-kids-center">
                                <AiOutlineDiscord className="icon" />
                                <p>Kids Center</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
)

export default VisitUs
