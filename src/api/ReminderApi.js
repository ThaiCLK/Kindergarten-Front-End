import AuthorApi from "./baseAPI/AuthorBaseApi"

class ReminderApi {
    constructor() {
        this.url = "/request/reminder" // Base URL for reminder-related API endpoints
    }

    // Fetches a list of reminders with optional search and pagination
    fetchRemindersList = async (search, pageNo, pageSize) => {
        return AuthorApi.get(`${this.url}?search=${search}&pageNo=${pageNo}&pageSize=${pageSize}`)
    }
}

export default new ReminderApi()
