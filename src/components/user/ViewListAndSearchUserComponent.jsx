import React, { useState, useEffect } from "react"
import LayoutComponents from "../common/LayoutComponents"
import "../../assets/scss/3-components/_viewListAndSearchUser.scss"
import { useNavigate, useLocation } from "react-router-dom"
import UserAPI from "../../api/UserApi"
import { formatDate, getRoleName, formatUserStatus } from "../../utils/fomatUtils"
import PaggingComponent from "../common/PaggingComponent"
import DeleteUserModal from "./modal/DeleteUserModal"
import SearchUserComponent from "../common/SearchUserComponent"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"
import TableComponent from "../common/TableComponent"
import { ToastContainer, toast, Bounce } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenSquare, faTrashAlt } from "@fortawesome/free-solid-svg-icons"

function ViewListAndSearchUserComponent() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const [searchKeyword, setSearchKeyword] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [resultsFound, setResultsFound] = useState(true)
    const location = useLocation()

    const columns = [
        {
            key: "fullName",
            title: "Full Name",
            render: (row) => (
                <div
                    className="user-link"
                    onClick={() => navigate(`/user-management/user-detail/${row.id}`)}
                    style={{ cursor: "pointer", color: "blue" }}
                >
                    {row.fullName}
                </div>
            )
        },
        { key: "email", title: "Email" },
        { key: "phone", title: "Phone No." },
        { key: "dob", title: "DOB" },
        { key: "address", title: "Address" },
        { key: "roleId", title: "Role" },
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
                    <div className="icon-left" onClick={() => handleEditUser(row.id)}>
                        <FontAwesomeIcon icon={faPenSquare} />
                    </div>
                    <div className="icon-right" onClick={() => handleDeleteUser(row.id)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </div>
                </div>
            )
        }
    ]

    const handleAddUserClick = () => {
        navigate("/user-management/add-new-user")
    }

    useEffect(
        () => {

            //Toastify
            if (location.state?.createNewUserSuccess) {
                toast.success(" Successfully created user!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce
                })
                navigate(location.pathname, { replace: true, state: {} })
            }

            if (location.state?.loginSuccess) {
                toast.success(" Login successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce
                })
                navigate(location.pathname, { replace: true, state: {} })
            }

            async function fetchUsersData(pageNo) {
                const usersData = await UserAPI.fetchUsersList(searchKeyword, pageNo, 10)
                const formattedUsers = usersData.item.map((user) => ({
                    ...user,
                    dob: formatDate(user.dob),
                    roleId: getRoleName(user.roleId),
                    status: formatUserStatus(user.status)
                }))
                setUsers(formattedUsers || [])
                setCurrentPage(usersData.pageNo)
                setTotalPage(usersData.totalPage)
                setResultsFound(formattedUsers.length !== 0)
            }

            fetchUsersData(currentPage)
        },
        [currentPage],
        [location.state]
    )

    const handleEditUser = (userId) => {
        navigate(`/user-management/user-detail/edit-user/${userId}`)
    }

    const handleDeleteUser = async (userId) => {
        const userToDelete = users.find((user) => user.id === userId)
        setUserToDelete(userToDelete)
        setShowDeleteModal(true)
    }

    const confirmDeleteUser = async () => {
        if (userToDelete) {
            await UserAPI.deleteUser(userToDelete.id)
            let updatedUsersData = await UserAPI.fetchUsersList(searchKeyword, currentPage, 10)

            if (updatedUsersData.item.length === 0 && currentPage > 1) {
                updatedUsersData = await UserAPI.fetchUsersList(searchKeyword, currentPage - 1, 10)
                setCurrentPage(currentPage - 1)
            }

            const formattedUsers = updatedUsersData.item.map((user) => ({
                ...user,
                dob: formatDate(user.dob),
                roleId: getRoleName(user.roleId),
                status: formatUserStatus(user.status)
            }))
            setUsers(formattedUsers || [])
            setTotalPage(updatedUsersData.totalPage)

            setResultsFound(formattedUsers.length !== 0)

            setShowDeleteModal(false)
            setUserToDelete(null)
        }
    }

    const handleCloseModal = () => {
        setShowDeleteModal(false)
        setUserToDelete(null)
    }

    const handleSearch = async (keyword) => {
        const usersData = await UserAPI.fetchUsersList(keyword, 1, 10)
        let formattedUsers = []
        if (usersData.item !== "No results found.") {
            setCurrentPage(1)
            formattedUsers = usersData.item.map((user) => ({
                ...user,
                dob: formatDate(user.dob),
                roleId: getRoleName(user.roleId),
                status: formatUserStatus(user.status)
            }))
        }

        setUsers(formattedUsers || [])
        setTotalPage(usersData.totalPage)
        setResultsFound(formattedUsers.length !== 0)
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <LayoutComponents title={"User List"}>
            <div>
                <ToastContainer
                    position="top-center"
                    autoClose={1600}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover={false}
                    theme="light"
                    transition={Bounce}
                />
                <div className="search-and-add-user">
                    <SearchUserComponent
                        searchKeyword={
                            searchKeyword === "inactive"
                                ? "Deactivated"
                                : searchKeyword === "active"
                                  ? "Activated"
                                  : searchKeyword
                        }
                        setSearchKeyword={setSearchKeyword}
                        handleSearch={handleSearch}
                    />

                    <Button
                        variant="contained"
                        onClick={handleAddUserClick}
                        style={{
                            height: "50px",
                            fontWeight: "bolder",
                            marginLeft: "10px"
                        }}
                    >
                        Add User
                    </Button>
                </div>

                {resultsFound ? (
                    <>
                        <TableComponent columns={columns} data={users} />
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

                <DeleteUserModal
                    visible={showDeleteModal}
                    onConfirm={confirmDeleteUser}
                    onCancel={handleCloseModal}
                    userToDelete={userToDelete}
                />
            </div>
        </LayoutComponents>
    )
}

export default ViewListAndSearchUserComponent
