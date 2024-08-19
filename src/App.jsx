import React, { useEffect } from "react"
import { BrowserRouter as Router, useRoutes, Navigate } from "react-router-dom"
import { routes } from "./routes"
import "bootstrap/dist/css/bootstrap.min.css"

function AppRoutes() {
    const routesWithRedirect = [
        {
            path: "/",
            element: <Navigate to="/home" />
        },
        ...routes
    ]

    return useRoutes(routesWithRedirect)
}

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    )
}

export default App
