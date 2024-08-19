export const validateFullName = (fullName) => {
    if (!fullName) return "Full Name is required."
    return null
}

export const validateEmail = (email) => {
    if (!email) {
        return "Email is required."
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
        return "Please enter a valid email address"
    }
    return null
}

export const validateEmailRegex = (email) => {
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
        return "Please enter a valid email address"
    }
    return null
}

export const validateDob = (dob) => {
    if (!dob) return "Date of Birth is required.";

    // Kiểm tra định dạng ngày sinh (YYYY-MM-DD)
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(dob)) {
        return "Date of Birth must be in the format MM/DD/YYYY.";
    }

    // Kiểm tra ngày sinh có hợp lệ không
    const date = new Date(dob);
    const currentDate = new Date();
    if (isNaN(date.getTime()) || date > currentDate) {
        return "Date of Birth must be in the past";
    }

    return null;
};


export const validatePhone = (phone) => {
    if (!phone) {
        return "Phone number is required."
    } else if (!/^0\d{9}$/.test(phone)) {
        return "Phone number is invalid."
    }
    return null
}

export const validateRoleId = (roleId) => {
    if (!roleId) return "Role is required."
    return null
}

export const validatePassword = (password) => {
    if (!password) return "Password is required."
    if (!/\d/.test(password) || !/[A-Za-z]/.test(password) || password.length < 9) {
        return "Use at least one number, one numeral, and seven characters."
    }
    return null
}

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Confirm password is required."
    if (password !== confirmPassword) return "Passwords do not match."
    return null
}
