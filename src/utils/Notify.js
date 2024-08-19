import "react-toastify/dist/ReactToastify.css"
import { toast, Bounce } from "react-toastify"

const notifyException = (message, status) => {
    const toastOptions = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        newestOnTop: true,
        transition: Bounce
    }

    switch (status) {
        case "success":
            toast.success(message, toastOptions)
            break
        case "error":
            toast.error(message, toastOptions)
            break
        case "info":
            toast.info(message, toastOptions)
            break
        case "warn":
            toast.warn(message, toastOptions)
            break
        default:
            toast(message, toastOptions)
    }
}

export { notifyException }
