import React from "react"
import { Outlet } from "react-router-dom"
import AdminSideBar from "../components/sidebar/AdminSideBar"
import Footer from "../components/Footer"
import Header from "../components/Header"

const AdminManageUser = () => {
    return (
        <div>
            <div style={{ display: "flex" }}>
                <AdminSideBar />
                <div style={{ width: "100%" }}>
                    <Header />
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AdminManageUser
