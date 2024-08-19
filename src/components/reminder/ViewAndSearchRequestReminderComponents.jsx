import { Alert, Stack } from "@mui/material"
import LayoutComponents from "../common/LayoutComponents"
import PaggingComponent from "../common/PaggingComponent"
import SearchUserComponent from "../common/SearchUserComponent"
import TableComponent from "../common/TableComponent"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import ReminderApi from "../../api/ReminderApi"

function ViewAndSearchRequestReminderComponents() {
    const navigate = useNavigate()
    const [reminders, setReminders] = useState([])

    const [searchKeyword, setSearchKeyword] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [resultsFound, setResultsFound] = useState(true)

    const columns = [
        {
            key: "fullName",
            title: "Full Name",
            render: (row) => (
                <div
                    className="user-link"
                    onClick={() => navigate(`/request-management/request-list/request-detail/${row.id}`)}
                    style={{ cursor: "pointer", color: "blue" }}
                >
                    {row.fullName}
                </div>
            )
        },
        { key: "email", title: "Email" },
        { key: "phone", title: "Phone No." },
        {
            key: "status",
            title: "Request Status",
            render: (row) => <div className={row.status}>{row.status}</div>
        },
        {
            key: "actions",
            title: "Actions",
            render: (row) => (
                <div
                    className="request-reminder-link"
                    onClick={() => {
                        localStorage.setItem("selectedItem", "request")
                        navigate(`/request-management/request-list/request-detail/${row.id}`)
                    }}
                    style={{
                        cursor: "pointer",
                        color: "blue",
                        textDecoration: "underline"
                    }}
                >
                    {"Go to review"}
                </div>
            )
        }
    ]

    useEffect(() => {
        async function fetchRemindersData(pageNo) {
            const remindersData = await ReminderApi.fetchRemindersList(searchKeyword, pageNo, 10)

            let formattedReminders = []
            if (remindersData.item !== "No results found.") {
                formattedReminders = remindersData.item.map((reminder) => ({
                    ...reminder
                }))
            }

            setReminders(formattedReminders || [])
            setCurrentPage(remindersData.pageNo)
            setTotalPage(remindersData.totalPage)
            setResultsFound(formattedReminders.length !== 0)
        }
        fetchRemindersData(currentPage)
    }, [currentPage])

    const handleSearch = async (keyword) => {
        const remindersData = await ReminderApi.fetchRemindersList(keyword, 1, 10)

        let formattedReminders = []
        if (remindersData.item !== "No results found.") {
            setCurrentPage(1)
            formattedReminders = remindersData.item.map((reminder) => ({
                ...reminder
            }))
        }

        setReminders(formattedReminders || [])
        setTotalPage(remindersData.totalPage)
        setResultsFound(formattedReminders.length !== 0)
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <LayoutComponents title={"Request Reminder"}>
            <div>
                <div className="search-and-add-user">
                    <SearchUserComponent
                        searchKeyword={searchKeyword}
                        setSearchKeyword={setSearchKeyword}
                        handleSearch={handleSearch}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: "-20px",
                        position: "relative",
                        top: "-30px",
                        paddingLeft: "15px"
                    }}
                >
                    <h4 style={{ marginBottom: "30px", fontSize: "21px" }}>Pending Tasks</h4>
                    <h5 style={{ fontSize: "18px" }}>
                        You have a list of submitted counseling requests which need to be reviewed.
                    </h5>
                </div>

                {resultsFound ? (
                    <>
                        <TableComponent columns={columns} data={reminders} />
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
            </div>
        </LayoutComponents>
    )
}

export default ViewAndSearchRequestReminderComponents
