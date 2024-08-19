// store.js
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./reducers/UserInfoSlice"

const store = configureStore({
    reducer: {
        auth: authReducer
    }
})

export default store
