import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PaggingComponent from "../common/PaggingComponent"
import SearchUserComponent from "../common/SearchUserComponent"
import TableComponent from "../common/TableComponent"
import LayoutComponents from "../common/LayoutComponents"
import RequestApi from "../../api/RequestApi"
import { Alert, Stack } from "@mui/material"

function ViewAndSearchRequestComponents() {
    const navigate = useNavigate()
    const [requests, setRequest] = useState([])

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
                    className="request-link"
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
        }
    ]

    useEffect(() => {
        async function fetchRequestsData(pageNo) {
            const requestsData = await RequestApi.fetchRequestsList(searchKeyword, pageNo, 10)
            let formattedRequest = []
            if (requestsData.item !== "No results found.") {
                formattedRequest = requestsData.item.map((school) => ({
                    ...school
                }))
            }

            setRequest(formattedRequest || [])
            setCurrentPage(requestsData.pageNo)
            setTotalPage(requestsData.totalPage)
            setResultsFound(formattedRequest.length !== 0)
        }
        fetchRequestsData(currentPage)
    }, [currentPage])

    const handleSearch = async (keyword) => {
        const requestsData = await RequestApi.fetchRequestsList(keyword, 1, 10)

        let formattedRequests = []
        if (requestsData.item !== "No results found.") {
            setCurrentPage(1)
            formattedRequests = requestsData.item.map((request) => ({
                ...request
            }))
        }

        setRequest(formattedRequests || [])
        setTotalPage(requestsData.totalPage)
        setResultsFound(formattedRequests.length !== 0)
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <LayoutComponents title={"Request List"}>
            <div>
                <div className="search-and-add-user">
                    <SearchUserComponent
                        searchKeyword={searchKeyword}
                        setSearchKeyword={setSearchKeyword}
                        handleSearch={handleSearch}
                    />
                </div>

                {resultsFound ? (
                    <>
                        <TableComponent columns={columns} data={requests} />
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
export default ViewAndSearchRequestComponents
