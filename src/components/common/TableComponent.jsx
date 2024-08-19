import React from "react"
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, tableCellClasses } from "@mui/material"
import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"
import "../../assets/scss/3-components/_tableStatus.scss"
import PropTypes from "prop-types"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover
    },
    "&:last-child td, &:last-child th": {
        border: 0
    }
}))

const TableComponent = ({ columns, data }) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {columns.map((column, index) => (
                            <StyledTableCell key={index} align="center">
                                {column.title}
                            </StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        <StyledTableRow key={index}>
                            {columns.map((column, colIndex) => (
                                <StyledTableCell key={colIndex} align="center">
                                    {column.render ? column.render(item) : item[column.key]}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

TableComponent.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            key: PropTypes.string,
            render: PropTypes.func
        }).isRequired
    ).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default TableComponent
