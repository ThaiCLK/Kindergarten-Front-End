import React from "react"
import Breadcrumbs from "./Breadcrumbs"
import "../../assets/scss/3-components/_wrapper.scss"
import { getSchoolStatusBySchoolId } from "../../utils/fomatUtils"
import { getSchoolStatusClass } from "../../utils/fomatUtils"
import PropTypes from "prop-types"

const LayoutComponents = ({ children, title, status }) => {
    return (
        <div className="wrapper">
            <div className="wrapper-breadscrumbs">
                <Breadcrumbs />
            </div>
            <div className="wrapper-content">
                <div className="wrapper-content__header">
                    <div className="title">
                        <h3 className="title_content">{title}</h3>
                        {status && (
                            <h3 className={"title" + getSchoolStatusClass(status)}>
                                {getSchoolStatusBySchoolId(status)}
                            </h3>
                        )}
                    </div>
                </div>
                <div className="wrapper-content__body">{children}</div>
            </div>
        </div>
    )
}

LayoutComponents.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default LayoutComponents
