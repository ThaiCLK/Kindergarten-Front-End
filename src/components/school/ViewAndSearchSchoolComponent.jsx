import React, { useState, useEffect } from "react"
import LayoutComponents from "../common/LayoutComponents"
import "../../assets/scss/3-components/_viewListAndSearchUser.scss"
import { useNavigate } from "react-router-dom"
import { formatDate, getSchoolStatusBySchoolId } from "../../utils/fomatUtils"
import PaggingComponent from "../common/PaggingComponent"
import SearchUserComponent from "../common/SearchUserComponent"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"
import TableComponent from "../common/TableComponent"
import SchoolApi from "../../api/SchoolApi"
import ModalComponent from "../common/ModalComponent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenSquare, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { ROLE, STATUS } from "../../constants"
import storage from "../../utils/storage"

function ViewAndSearchSchoolComponent() {
    const navigate = useNavigate()
    const [schools, setSchools] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [searchKeyword, setSearchKeyword] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [resultsFound, setResultsFound] = useState(true)
    const [role, setRole] = useState("")

    const [schoolToDelete, setSchoolToDelete] = useState("")

    const columns = [
        {
            key: "schoolName",
            title: "School Name",
            render: (row) => (
                <div
                    className="school-link"
                    onClick={() => navigate(`/school-management/school-detail/${row.id}`)}
                    style={{ cursor: "pointer", color: "blue" }}
                >
                    {row.schoolName}
                </div>
            )
        },
        { key: "address", title: "Address" },
        { key: "phone", title: "Phone No" },
        { key: "email", title: "Email" },
        { key: "postedDate", title: "Posted Date" },
        {
            key: "status",
            title: "Status",
            render: (row) => <div className={row.status}>{row.status}</div>
        },
        {
            key: "actions",
            title: "Actions",
            render: (row) => (
                <div
                    className="icon"
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-around"
                    }}
                >
                    <div className="icon-left" onClick={() => handleEditSchool(row.id)}>
                        <FontAwesomeIcon icon={faPenSquare} />
                    </div>
                    {!(role === 'SCHOOL_OWNER' && row.status === 'Approved') && (
                        <div className="icon-right" onClick={() => handleDeleteSchool(row.id)}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </div>
                    )}
                </div>
            )
        }
    ]

    const handleAddSchoolClick = () => {
        navigate("/school-management/add-new-school")
    }

    useEffect(() => {
        async function fetchSchoolsData(pageNo) {
            const schoolsData = await SchoolApi.fetchSchoolList(searchKeyword, pageNo, 10)

            let formattedSchools = []
            if (schoolsData.item !== "No results found.") {
                formattedSchools = schoolsData.item.map((school) => ({
                    ...school,
                    postedDate: formatDate(school.postedDate),
                    status: getSchoolStatusBySchoolId(school.status.id)
                }))
            }
            setSchools(formattedSchools || [])
            setCurrentPage(schoolsData.pageNo)
            setTotalPage(schoolsData.totalPage)
            setResultsFound(formattedSchools.length !== 0)

            const user = storage.getUserInfo()
            setRole(user.role)
        }
        fetchSchoolsData(currentPage)
    }, [currentPage])

    const handleEditSchool = (id) => {
        navigate(`/school-management/school-detail/edit-school/${id}`)
    }

    const handleDeleteSchool = async (Id) => {
        const deleteSchool = schools.find((schools) => schools.id === Id)
        if (
            deleteSchool.status === STATUS.DELETED ||
            deleteSchool.status === "Deleted" ||
            (role === ROLE.SCHOOL_OWNER &&
                (deleteSchool.status === STATUS.APPROVED || deleteSchool.status === "Approved"))
        ) {
            setSchoolToDelete("")
            setShowDeleteModal(false)
        } else {
            setSchoolToDelete(deleteSchool)
            setShowDeleteModal(true)
        }
    }

    const confirmDeleteSchool = async () => {
        if (schoolToDelete) {
            await SchoolApi.changeStatusSchool(schoolToDelete.id, STATUS.DELETED)

            let updatedSchoolsData = await SchoolApi.fetchSchoolList(searchKeyword, currentPage, 10)

            if (updatedSchoolsData.item.length === 0 && currentPage > 1) {
                updatedSchoolsData = await SchoolApi.fetchSchoolList(searchKeyword, currentPage - 1, 10)
                setCurrentPage(currentPage - 1)
            }

            const formattedSchools = updatedSchoolsData.item.map((school) => ({
                ...school,
                postedDate: formatDate(school.postedDate),
                status: getSchoolStatusBySchoolId(school.status.id)
            }))

            setSchools(formattedSchools || [])
            setTotalPage(updatedSchoolsData.totalPage)
            setResultsFound(formattedSchools.length !== 0)
            setShowDeleteModal(false)
            setSchoolToDelete(null)
        }
    }

    const handleCloseModal = () => {
        setShowDeleteModal(false)
        setSchoolToDelete(null)
    }

    const handleSearch = async (keyword) => {
        const schoolsData = await SchoolApi.fetchSchoolList(keyword, 1, 10)

        let formattedSchools = []
        if (schoolsData.item !== "No results found.") {
            setCurrentPage(1)
            formattedSchools = schoolsData.item.map((school) => ({
                ...school,
                postedDate: formatDate(school.postedDate),
                status: getSchoolStatusBySchoolId(school.status.id)
            }))
        }

        setSchools(formattedSchools || [])
        setTotalPage(schoolsData.totalPage)
        setResultsFound(formattedSchools.length !== 0)
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <LayoutComponents title={"School List"}>
            <div>
                <div className="search-and-add-user">
                    <SearchUserComponent
                        searchKeyword={searchKeyword}
                        setSearchKeyword={setSearchKeyword}
                        handleSearch={handleSearch}
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddSchoolClick}
                        style={{
                            height: "50px",
                            fontWeight: "bolder",
                            marginLeft: "10px"
                        }}
                    >
                        Add School
                    </Button>
                </div>

                {resultsFound ? (
                    <>
                        <TableComponent columns={columns} data={schools} />
                        <div style={{ paddingTop: "20px" }}>
                            <PaggingComponent
                                count={totalPage}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                ) : (
                    <Stack spacing={2} style={{ marginTop: "20px" }}>
                        <Alert severity="info">No results found.</Alert>
                    </Stack>
                )}

                <ModalComponent
                    visible={showDeleteModal}
                    onCancel={handleCloseModal}
                    onConfirm={confirmDeleteSchool}
                    modalTitle="Delete School"
                    modalContent={
                        <>
                            <div>Are you sure you want to continue?</div>
                            <div style={{ color: "red" }}>This action is permanent and cannot be undone!</div>
                        </>
                    }
                    buttonLeft="Cancel"
                    buttonRight="Delete"
                />
            </div>
        </LayoutComponents>
    )
}

export default ViewAndSearchSchoolComponent
