import React from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import PropTypes from "prop-types"
import useDebounce from "../../hooks/useDebounce"

function SearchUserComponent({ searchKeyword, setSearchKeyword, handleSearch }) {
    // Sử dụng useDebounce hook
    const debouncedSearch = useDebounce((value) => {
        handleSearch(encodeURIComponent(value))
    }, 300)

    const handleChange = (e) => {
        let value = e.target.value

        if (value === "Activated") {
            value = "active"            
        } else if (value === "Deactivated") {
            value = "inactive"  
        }

        setSearchKeyword(value)
        debouncedSearch(value)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
        }
    }

    return (
        <Box
            component="form"
            sx={{
                "& > :not(style)": {
                    m: 1,
                    width: "25ch",
                    margin: "0",
                    marginBottom: "25px"
                }
            }}
            noValidate
            autoComplete="off"
        >
            <TextField
                id="outlined-basic"
                type="text"
                value={searchKeyword}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Search by name, email, etc."
                label="Search for..."
                variant="outlined"
                style={{ width: "450px" }}
            />
        </Box>
    )
}

// Prop type validation
SearchUserComponent.propTypes = {
    searchKeyword: PropTypes.string.isRequired,
    setSearchKeyword: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired
}

export default SearchUserComponent
