import AuthorApi from "./baseAPI/AuthorBaseApi"
import UnauthorApi from "./baseAPI/UnauthorBaseApi"

class SchoolAPI {
    constructor() {
        this.url = "/school" // Base URL for school-related endpoints
    }

    // Fetches the list of published schools
    getListPublishedSchool = async () => {
        return AuthorApi.get(`${this.url}/published`)
    }

    // Fetches a list of schools with optional search, page number, and page size parameters
    fetchSchoolList = async (search, pageNo, pageSize) => {
        return AuthorApi.get(`${this.url}/list?search=${search}&pageNo=${pageNo}&pageSize=${pageSize}`)
    }

    // Fetches the details of a specific school by ID
    fetchSchoolDetail = async (id) => {
        return AuthorApi.get(`${this.url}/detail/${id}`)
    }

    // Changes the status of a specific school by ID
    changeStatusSchool = async (id, statusId) => {
        return AuthorApi.patch(`${this.url}/${id}?statusId=${statusId}`)
    }

    // Fetches the list of school age categories
    getSchoolAge = async () => {
        return AuthorApi.get(`${this.url}/age`)
    }

    // Fetches the list of school utilities
    getSchoolUtilities = async () => {
        return AuthorApi.get(`${this.url}/utilities`)
    }

    // Fetches the list of school facilities
    getSchoolFacilities = async () => {
        return AuthorApi.get(`${this.url}/facilities`)
    }

    getSchoolUtilitiesPublic = async () => {
        return UnauthorApi.get(`${this.url}/utilities`)
    }

    getSchoolFacilitiesPublic = async () => {
        return UnauthorApi.get(`${this.url}/facilities`)
    }

    // Fetches the list of school education methods
    getSchoolEducationMethods = async () => {
        return AuthorApi.get(`${this.url}/education-methods`)
    }

    // Fetches the list of school types
    getSchoolType = async () => {
        return AuthorApi.get(`${this.url}/type`)
    }
    getCurrentSchool = async () => {
        return AuthorApi.get(`${this.url}/currentSchool`)
    }

    getPreviousSchool = async (pageNo) => {
        return AuthorApi.get(`${this.url}/previousSchool?pageNo=${pageNo}&pageSize=3`)
    }

    getSchoolTopFeedback = async () => {
        return UnauthorApi.get(`feedback/top?limit=4&average=5`)
    }

    getSchoolRangeAgePublic = async () => {
        return UnauthorApi.get(`${this.url}/age`)
    }
    getSchoolTypePublic = async () => {
        return UnauthorApi.get(`${this.url}/type`)
    }

    getSchoolByFilter = async (
        pageNum,
        size,
        sortBy,
        schoolAge,
        schoolType,
        feeFrom,
        feeTo,
        facilities,
        utilities,
        searchKey,
        provine,
        city
    ) => {
        return UnauthorApi.get(
            `${this.url}/filter?page=${pageNum}&size=${size}&sortBy=${sortBy}&schoolAge=${schoolAge}&schoolType=${schoolType}&feeFrom=${feeFrom}&feeTo=${feeTo}&facilities=${facilities}&utilities=${utilities}&search=${searchKey}&provine=${provine}&city=${city}`
        )
    }

    // Creates a new school with provided data and images
    createNewSchool = async (school, images) => {
        const formData = new FormData()

        const schoolData = {
            name: school.name,
            type: school.type,
            addressLine: school.addressLine,
            ward: school.ward,
            district: school.district,
            city: school.city,
            email: school.email,
            phone: school.phone,
            age: school.age,
            method: school.method,
            feeFrom: school.feeFrom,
            feeTo: school.feeTo,
            facilities: school.facilities,
            utilities: school.utilities,
            introduction: school.introduction
        }

        // Convert school data to Blob and append to FormData
        const json = JSON.stringify(schoolData)
        const blob = new Blob([json], { type: "application/json" })
        formData.append("data", blob)

        // Check if there are images and append them to FormData
        if (images && images.length > 0) {
            images.forEach((image, index) => {
                if (image.originFileObj) {
                    // Create a unique filename for each image
                    const uniqueFileName = `${index}_${image.name}`
                    const file = new File([image.originFileObj], uniqueFileName, {
                        type: image.originFileObj.type
                    })
                    formData.append("images", file, uniqueFileName)
                } else {
                    console.error("No originFileObj found for image:", image)
                }
            })
        }

        // Send POST request with Axios
        return AuthorApi.post(`${this.url}/create`, formData, {
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data"
            }
        })
    }

    // Saves a draft of a school with provided data and images
    saveDraft = async (school, images) => {
        const formData = new FormData()

        const schoolData = {
            name: school.name,
            type: school.type,
            addressLine: school.addressLine,
            ward: school.ward,
            district: school.district,
            city: school.city,
            email: school.email,
            phone: school.phone,
            age: school.age,
            method: school.method,
            feeFrom: school.feeFrom,
            feeTo: school.feeTo,
            facilities: school.facilities,
            utilities: school.utilities,
            introduction: school.introduction
        }

        // Convert school data to Blob and append to FormData
        const json = JSON.stringify(schoolData)
        const blob = new Blob([json], { type: "application/json" })
        formData.append("data", blob)

        // Check if there are images and append them to FormData
        if (images && images.length > 0) {
            images.forEach((image, index) => {
                if (image.originFileObj) {
                    // Create a unique filename for each image
                    const uniqueFileName = `${index}_${image.name}`
                    const file = new File([image.originFileObj], uniqueFileName, {
                        type: image.originFileObj.type
                    })
                    formData.append("images", file, uniqueFileName)
                } else {
                    console.error("No originFileObj found for image:", image)
                }
            })
        }

        // Send POST request with Axios
        return AuthorApi.post(`${this.url}/draft`, formData, {
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data"
            }
        })
    }

    // Fetches ratings for a specific school by date range
    getRatingByDate = async (startDate, endDate, id) => {
        return AuthorApi.get(`${this.url}/rating/${id}?startDate=${startDate}&endDate=${endDate}`)
    }
    getRatingById = async (id) => {
        return UnauthorApi.get(`${this.url}/rating/${id}`)
    }
    getRatingFix = async () => {
        return UnauthorApi.get(`${this.url}/rating/1`)
    }
    ratingSchoolByUser = async (data) => {
        return AuthorApi.post(`/rating`, data)
    }

    // Fetches feedback for a specific school by date range, rating range, and limit
    getFeedbackByDate = async (startDate, endDate, id, listNumStar, limit) => {
        return AuthorApi.get(
            `${this.url}/feedback/${id}?startDate=${startDate}&endDate=${endDate}&ratingRange=${listNumStar}&limit=${limit}`
        )
    }
    getFeedbackAll = async (id) => {
        return UnauthorApi.get(`${this.url}/feedback/${id}?limit=3`)
    }
    getFeedbackByFilter = async (id, ratingRange, pageNo) => {
        return UnauthorApi.get(
            `${this.url}/public/feedback/${id}?&ratingRange=${ratingRange}&pageNo=${pageNo}&pageSize=10`
        )
    }

    // Fetches all required data for schools
    fetchAllRequiredData = async () => {
        try {
            const [facilities, utilities, ages, methods, types] = await Promise.all([
                this.getSchoolFacilities(),
                this.getSchoolUtilities(),
                this.getSchoolAge(),
                this.getSchoolEducationMethods(),
                this.getSchoolType()
            ])

            return {
                facilities: facilities,
                utilities: utilities,
                ages: ages,
                methods: methods,
                types: types
            }
        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }

    // Edits an existing school with new data and images
    editSchool = async (school, id, images) => {
        const formData = new FormData()
        const body = {
            name: school.name,
            type: school.type,
            addressLine: school.addressLine,
            ward: school.ward,
            district: school.district,
            city: school.city,
            email: school.email,
            phone: school.phone,
            age: school.age,
            method: school.method,
            feeFrom: school.feeFrom,
            feeTo: school.feeTo,
            facilities: school.facilities,
            utilities: school.utilities,
            introduction: school.introduction
        }
        const json = JSON.stringify(body)
        const blob = new Blob([json], { type: "application/json" })
        formData.append("data", blob)

        // Handle old images
        const oldImages = images.filter((image) => image.status === "OLD_IMAGES")
        if (oldImages.length > 0) {
            const oldImagesObject = oldImages.map((image) => ({
                id: image.id,
                imagePath: image.url // Chuyển url thành imagePath
            }))
            const oldImagesJson = JSON.stringify(oldImagesObject)
            const oldImagesBlob = new Blob([oldImagesJson], {
                type: "application/json"
            })
            formData.append("oldImages", oldImagesBlob)
        }

        // Handle new images
        const newImages = images.filter((image) => image.status === "NEW_IMAGES")
        if (newImages.length > 0) {
            newImages.forEach((image, index) => {
                if (image.originFileObj) {
                    const uniqueFileName = `${index}_${image.name}`
                    const file = new File([image.originFileObj], uniqueFileName, {
                        type: image.originFileObj.type
                    })
                    formData.append("images", file, uniqueFileName)
                } else {
                    console.error("No originFileObj found for image:", image)
                }
            })
        }

        // Send PUT request with Axios
        return AuthorApi.put(`${this.url}/${id}`, formData, {
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data"
            }
        })
    }
}

export default new SchoolAPI()
