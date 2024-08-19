const getRoleName = (roleId) => {
    switch (roleId) {
        case 1:
            return "Admin"
        case 2:
            return "Parent"
        case 3:
            return "School Owner"
        default:
            return "Unknown"
    }
}

const formatRoleName = (role) => {
    switch (role) {
        case "ADMIN":
            return "Admin"
        case "PARENT":
            return "Parent"
        case "SCHOOL_OWNER":
            return "School Owner"
        default:
            return "Unknown"
    }
}

const formatUserStatus = (status) => {
    switch (status) {
        case "Active":
            return "Activated"
        case "Inactive":
            return "Deactivated"
        default:
            return "Unknown"
    }
}

const getModalInfo = (status) => {
    switch (status) {
        case "Open":
            return {
                title: "Mark request resolved",
                content: "Are you sure you want to mark this request resolved?",
                buttonLeft: "No. Take me back!",
                buttonRight: "Yes"
            }
        case 3:
            return {
                title: "Approve School",
                content: "Are you sure you want to continue?",
                buttonLeft: "No. Take me back!",
                buttonRight: "Yes. Continue"
            }
        case 4:
            return {
                title: "Reject School",
                content: "Are you sure you want to continue?",
                buttonLeft: "No. Take me back!",
                buttonRight: "Yes. Continue"
            }
        case 5:
            return {
                title: "Publish School",
                content: "Are you sure you want to publish this school?",
                buttonLeft: "No. Take me back!",
                buttonRight: "Yes. Continue"
            }
        case 6:
            return {
                title: "Unpublish School",
                content: "Are you sure you want to unpublish this school?",
                buttonLeft: "No. Take me back!",
                buttonRight: "Yes. Continue"
            }
        case 7:
            return {
                title: "Delete School",
                content: (
                    <>
                        <div>Are you sure you want to continue?</div>
                        <div style={{ color: "red" }}>This action is permanent and cannot be undone!</div>
                    </>
                ),
                buttonLeft: "Cancel",
                buttonRight: "Delete"
            }
        default:
            return {
                title: "Unknown",
                content: "Unknown",
                buttonLeft: "Unknown",
                buttonRight: "Unknown"
            }
    }
}

const getSchoolStatusBySchoolId = (Id) => {
    switch (Id) {
        case 1:
            return "Saved"
        case 2:
            return "Submitted"
        case 3:
            return "Approved"
        case 4:
            return "Rejected"
        case 5:
            return "Published"
        case 6:
            return "Unpublished"
        case 7:
            return "Deleted"
        case "Open":
            return "Open"
        case "Closed":
            return "Closed"
        default:
            return "Unknown"
    }
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

const formatDateForInput = (isoDate) => {
    const date = new Date(isoDate)
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
    return formattedDate
}

const isFullNameValid = (fullName) => {
    return fullName.trim() !== ""
}

const getSchoolStatusClass = (status) => {
    const classMap = {
        1: "_SAVED",
        2: "_SUBMITTED",
        3: "_APPROVED",
        4: "_REJECTED",
        5: "_PUBLISHED",
        6: "_UNPUBLISHED",
        7: "_DELETED",
        Open: "_OPEN",
        Closed: "_CLOSED"
    }
    return classMap[status] || "_UNKNOWN"
}

export {
    formatDate,
    getRoleName,
    formatDateForInput,
    isFullNameValid,
    getModalInfo,
    getSchoolStatusBySchoolId,
    formatUserStatus,
    getSchoolStatusClass,
    formatRoleName
}
