import AuthorApi from "./baseAPI/AuthorBaseApi"

class UserAPI {
    constructor() {
        this.url = "/user" // Base URL for user-related endpoints
    }

    // Get User Role
    getUserRole = async () => {
        return AuthorApi.get(`/role/list`)
    }

    // Creates a new user with provided data
    createNewUser = async (user) => {
        const body = {
            userName: user.userName,
            fullName: user.fullName,
            email: user.email,
            dob: user.dob, // Date of Birth
            phone: user.phone,
            roleId: user.roleId,
            status: user.status
        }
        return AuthorApi.post(`${this.url}`, body)
    }

    // Fetches a list of users with optional search, page number, and page size parameters
    fetchUsersList = async (search, pageNo, pageSize) => {
        return AuthorApi.get(`${this.url}/list?search=${search}&pageNo=${pageNo}&pageSize=${pageSize}`)
    }

    // Deletes a specific user by ID
    deleteUser = async (userId) => {
        return AuthorApi.delete(`${this.url}/${userId}`)
    }

    // Creates a username suggestion based on the full name
    createUsernameFromFullName = async (fullName) => {
        return AuthorApi.get(`${this.url}/username?fullName=${fullName}`)
    }

    editUsernameFromFullName = async (fullName, id) => {
        return AuthorApi.get(`${this.url}/edit/username?fullName=${fullName}&userId=${id}`)
    }

    // Updates the status of a specific user by ID
    updateStatus = async (user, newStatus) => {
        return AuthorApi.patch(`${this.url}/${user.id}?status=${newStatus}`)
    }

    // Fetches the details of a specific user by ID
    getUserDetail = async (id) => {
        return AuthorApi.get(`${this.url}/${id}`)
    }

    getParentDetail = async (id) => {
        return AuthorApi.get(`parent/info/${id}`)
    }

    // Updates the details of a specific user by ID
    updateUserDetail = async (id, user) => {
        const body = {
            userName: user.userName,
            fullName: user.fullName,
            email: user.email,
            dob: user.dob,
            phone: user.phone,
            roleId: user.roleId,
            status: user.status
        }
        return AuthorApi.put(`${this.url}/${id}`, body)
    }
}
export default new UserAPI()
