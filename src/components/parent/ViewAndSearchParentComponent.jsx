import { Alert, Stack } from "@mui/material"
import LayoutComponents from "../common/LayoutComponents"
import PaggingComponent from "../common/PaggingComponent"
import SearchUserComponent from "../common/SearchUserComponent"
import TableComponent from "../common/TableComponent"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import ParentApi from "../../api/ParentApi"
import { React } from "../.."
import { ToastContainer, toast, Bounce } from "react-toastify"

function ViewAndSearchParentComponent() {
    const navigate = useNavigate()
    const [parents, setParents] = useState([])

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
                    className="parent-link"
                    onClick={() => navigate(`/parent-management/parent-list/parent-detail/${row.id}`)}
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
            title: "Status",
            render: (row) => (
                <div className={row.status === false ? "Not_Enrolled" : "Enrolled"}>
                    {row.status === false ? "Not enrolled yet" : "Enrolled"}
                </div>
            )
        }
    ]

    useEffect(() => {

        //Enrolled parent to school
        if (location.state?.enrolledParentToSchool) {
            toast.success("Enrolled the parent successfully into the school.", {
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

        async function fetchParentsData(pageNo) {
            const parentsData = await ParentApi.fetchParentsList(searchKeyword, pageNo, 10)
            let formattedParents = []
            if (parentsData.item !== "No results found.") {
                formattedParents = parentsData.item.map((parent) => ({
                    ...parent
                }))
            }

            setParents(formattedParents || [])
            setCurrentPage(parentsData.pageNo)
            setTotalPage(parentsData.totalPage)
            setResultsFound(formattedParents.length !== 0)
        }
        fetchParentsData(currentPage)
    }, [currentPage],
        [location.state]
    )

    const handleSearch = async (keyword) => {
        const parentsData = await ParentApi.fetchParentsList(keyword, 1, 10)

        let formattedParents = []
        if (parentsData.item !== "No results found.") {
            setCurrentPage(1)
            formattedParents = parentsData.item.map((parent) => ({
                ...parent
            }))
        }

        setParents(formattedParents || [])
        setTotalPage(parentsData.totalPage)
        setResultsFound(formattedParents.length !== 0)
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <LayoutComponents title={"Parent List"}>
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
                        searchKeyword={searchKeyword}
                        setSearchKeyword={setSearchKeyword}
                        handleSearch={handleSearch}
                    />
                </div>

                {resultsFound ? (
                    <>
                        <TableComponent columns={columns} data={parents} />
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
export default ViewAndSearchParentComponent
