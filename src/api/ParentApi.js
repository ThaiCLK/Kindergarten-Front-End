import AuthorApi from "./baseAPI/AuthorBaseApi"

class ParentApi {
    constructor() {
        this.url = "/parent"
    }

    fetchParentsList = async (search, pageNo, pageSize) => {
        return AuthorApi.get(`${this.url}/list?search=${search}&pageNo=${pageNo}&pageSize=${pageSize}`)
    }

    // Retrieves detailed information of a specific parent by ID when login in Content Web System
    getParentDetailContentWebSystem = async (id) => {
        return AuthorApi.get(`${this.url}/${id}`);
    };

    // Retrieves detailed information of a specific parent by ID when login into Public Web
    getParentDetailPublicWeb = async (id) => {
        return AuthorApi.get(`${this.url}/info/${id}`);
    };

    // Enrolls a parent to a specific school
    enrollParentToSchool = async (parentId, schoolId) => {
        const body = {
            parentId: parentId,
            schoolId: schoolId
        }
        return AuthorApi.post(`${this.url}`, body)
    }

    // Unenrolls a parent from a specific school
    unEnrollParentToSchool = async (parentId, schoolId) => {
        return AuthorApi.patch(`${this.url}/${parentId}?school=${schoolId}`)
    }

    updateParent = async (id, parentData, images) => {
        const formData = new FormData();
        const parent = {
            fullName: parentData.fullName,
            email: parentData.email,
            dob: parentData.dob,
            phone: parentData.phone,
            city: parentData.city,
            district: parentData.district,
            ward: parentData.ward,
            addressLine: parentData.addressLine,
        };
        const json = JSON.stringify(parent)
        const blob = new Blob([json], { type: "application/json" })
        formData.append("data", blob)

        if (images && images.length > 0) {
            images.forEach((image, index) => {
                if (image.originFileObj) {
                    // Create a unique filename for each image
                    const uniqueFileName = `${index}_${image.name}`
                    const file = new File([image.originFileObj], uniqueFileName, {
                        type: image.originFileObj.type
                    })
                    formData.append("avatar", file, uniqueFileName)
                } else {
                    console.error("No originFileObj found for image:", image)
                }
            })
        }

        return AuthorApi.put(`${this.url}/info/${id}`, formData, {
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data"
            }
        })
    }

    changePassword = async (id, parentPassword) => {
        const body = {
            oldPassword: parentPassword.oldPassword,
            newPassword: parentPassword.newPassword
        }
        return AuthorApi.patch(`${this.url}/info/${id}`, body)
    }
}
export default new ParentApi()
