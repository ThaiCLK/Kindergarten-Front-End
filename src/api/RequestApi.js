import AuthorApi from "./baseAPI/AuthorBaseApi"

class RequestApi {
    constructor() {
        this.url = "/request" // Base URL for request-related endpoints
    }

    // Fetches a list of requests with optional search, page number, and page size parameters
    fetchRequestsList = async (search, pageNo, pageSize) => {
        return AuthorApi.get(`${this.url}/list?search=${search}&pageNo=${pageNo}&pageSize=${pageSize}`)
    }

    // Fetches the details of a specific request by ID
    getRequestDetail = async (id) => {
        return AuthorApi.get(`${this.url}/${id}`)
    }

    addRequestPublic = async (body) => {
        return AuthorApi.post(`${this.url}/public`, body)
    }

    // Changes the status of a specific request by ID
    changeRequestStatus = async (id, status) => {
        return AuthorApi.patch(`${this.url}/${id}?status=${status}`)
    }

    viewMyRequest = async (pageNo, pageSize) => {
        return AuthorApi.get(`${this.url}/public/myRequest?&pageNo=${pageNo}&pageSize=${pageSize}`)
    }
}
export default new RequestApi()
