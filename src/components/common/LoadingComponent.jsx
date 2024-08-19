import React from "react"
import "../../assets/scss/3-components/_loading.scss"
import { Box, CircularProgress } from "@mui/material"

function LoadingComponent() {
    return (
        <Box className="loading-container">
            <CircularProgress className="circular-progress" />
        </Box>
    )
}

export default LoadingComponent
