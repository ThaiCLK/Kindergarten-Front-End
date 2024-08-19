import React, { useState } from "react"
import ModalComponent from "../common/ModalComponent"
import SchoolApi from "../../api/SchoolApi"
import { getModalInfo } from "../../utils/fomatUtils"
import { useNavigate } from "react-router-dom"
import "../../assets/scss/3-components/_renderButton.scss"
import RequestApi from "../../api/RequestApi"
import { STATUS, ROLE } from "../../constants"
import PropTypes from "prop-types"

const RenderButtonComponent = ({ userRole, status, id }) => {
    const [showModal, setShowModal] = useState(false)
    const [changeStatus, setChangeStatus] = useState("")
    const navigate = useNavigate()

    const handleOpenModal = (newStatus) => {
        setChangeStatus(newStatus)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleConfirm = async () => {
        if (status === STATUS.OPEN) {
            await RequestApi.changeRequestStatus(id, STATUS.CLOSED)
            handleCloseModal()
            navigate("/request-management/request-list")
        } else {
            await SchoolApi.changeStatusSchool(id, changeStatus)
            handleCloseModal()
            navigate("/school-management/school-list")
        }
    }

    const handleEditSchool = (schoolId) => {
        navigate(`/school-management/school-detail/edit-school/${schoolId}`)
    }

    const renderButtons = () => {
        switch (userRole) {
            case ROLE.SCHOOL_OWNER:
                switch (status) {
                    case STATUS.SAVED:
                        return (
                            <>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleEditSchool(id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.SUBMITTED)}
                                >
                                    Submit
                                </button>
                            </>
                        )
                    case STATUS.SUBMITTED:
                        return (
                            <>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.DELETED)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleEditSchool(id)}
                                >
                                    Edit
                                </button>
                            </>
                        )
                    case STATUS.APPROVED:
                        return (
                            <>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleEditSchool(id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.PUBLISHED)}
                                >
                                    Publish
                                </button>
                            </>
                        )
                    case STATUS.PUBLISHED:
                        return (
                            <>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.DELETED)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleEditSchool(id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.UNPUBLISHED)}
                                >
                                    Unpublish
                                </button>
                            </>
                        )
                    case STATUS.UNPUBLISHED:
                        return (
                            <>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.DELETED)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleEditSchool(id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.PUBLISHED)}
                                >
                                    Publish
                                </button>
                            </>
                        )
                    case STATUS.OPEN:
                        return (
                            <>
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        marginLeft: "20px",
                                        width: "160px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.OPEN)}
                                >
                                    Mark it resolved
                                </button>
                            </>
                        )
                    case STATUS.CLOSED:
                        return <></>
                    default:
                        return null
                }
            case ROLE.ADMIN:
                switch (status) {
                    case STATUS.SUBMITTED:
                        return (
                            <>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.DELETED)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleEditSchool(id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.REJECTED)}
                                >
                                    Reject
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.APPROVED)}
                                >
                                    Approve
                                </button>
                            </>
                        )
                    case STATUS.APPROVED:
                        return (
                            <>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.DELETED)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleEditSchool(id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.PUBLISHED)}
                                >
                                    Publish
                                </button>
                            </>
                        )
                    case STATUS.PUBLISHED:
                        return (
                            <>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.DELETED)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleEditSchool(id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.UNPUBLISHED)}
                                >
                                    Unpublish
                                </button>
                            </>
                        )
                    case STATUS.UNPUBLISHED:
                        return (
                            <>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.DELETED)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleEditSchool(id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        marginLeft: "20px",
                                        width: "100px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.PUBLISHED)}
                                >
                                    Publish
                                </button>
                            </>
                        )
                    case STATUS.OPEN:
                        return (
                            <>
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        marginLeft: "20px",
                                        width: "160px"
                                    }}
                                    onClick={() => handleOpenModal(STATUS.OPEN)}
                                >
                                    Mark it resolved
                                </button>
                            </>
                        )
                    case STATUS.CLOSED:
                        return <></>
                    default:
                        return null
                }

            default:
                return null
        }
    }

    return (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {renderButtons()}
            <ModalComponent
                visible={showModal}
                onCancel={handleCloseModal}
                onConfirm={handleConfirm}
                modalTitle={getModalInfo(changeStatus).title}
                modalContent={getModalInfo(changeStatus).content}
                buttonLeft={getModalInfo(changeStatus).buttonLeft}
                buttonRight={getModalInfo(changeStatus).buttonRight}
            />
        </div>
    )
}

RenderButtonComponent.propTypes = {
    userRole: PropTypes.string,
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default RenderButtonComponent
