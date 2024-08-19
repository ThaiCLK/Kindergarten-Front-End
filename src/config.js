// Cấu hình API cơ bản
export const apiConfig = {
  baseURL: process.env.REACT_APP_KINDERGARTEN_API || "http://localhost:8080", // Sử dụng biến môi trường nếu có
  headers: {
    "Content-Type": "application/json",
    "URL": window.location.href // Lấy URL hiện tại của trang
  }
}

// Cấu hình các API khác
export const apiEndpoints = {
  cityApi: process.env.REACT_APP_CITY_API,
  districtsApi: process.env.REACT_APP_DISTRICTS_API,
  wardsApi: process.env.REACT_APP_WARDS_API
}
