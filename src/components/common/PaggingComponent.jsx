import React from "react"
import Pagination from "@mui/material/Pagination"
import PaginationItem from "@mui/material/PaginationItem"
import Stack from "@mui/material/Stack"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import "../../assets/scss/3-components/_pagging.scss"
import PropTypes from "prop-types"

const PaggingComponent = ({ count, currentPage, onPageChange }) => {
    return (
        <Stack spacing={2}>
            <Pagination
                count={count}
                page={currentPage}
                onChange={(event, page) => onPageChange(page)}
                renderItem={(item) => (
                    <PaginationItem
                        // style={{ justifyContent: 'center' }}
                        slots={{
                            previous: ArrowBackIcon,
                            next: ArrowForwardIcon
                        }}
                        {...item}
                    />
                )}
            />
        </Stack>
    )
}

PaggingComponent.propTypes = {
    count: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
}

export default PaggingComponent
