import React from "react";
import "../assets/scss/Landing.scss";
import "bootstrap/dist/css/bootstrap.css";
import SearchSection from "../components/homepage/SearchSectionComponent";
import Testimonials from "../components/homepage/TestimonialComponent";
import AboutUs from "../components/homepage/AboutUsComponent";
import VisitUs from "../components/homepage/VisitUsComponent";


const HomePage = () => {
    return (
        <div className="landing-page">
            <>
                <SearchSection />
                <Testimonials />
                <AboutUs />
                <VisitUs />
            </>
        </div>
    )
}

export default HomePage
