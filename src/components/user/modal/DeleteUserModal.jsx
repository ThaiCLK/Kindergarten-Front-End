import React, { useState } from "react"
import { Modal } from "antd"
import PropTypes from "prop-types"

const DeleteUserModal = ({ visible, onConfirm, onCancel, userToDelete }) => {
    const [confirmLoading, setConfirmLoading] = useState(false)

    const handleOk = () => {
        setConfirmLoading(true)
        setTimeout(() => {
            onConfirm()
            setConfirmLoading(false)
        }, 2000)
    }

    return (
        <Modal
            title="Delete User"
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
            okButtonProps={{
                style: { backgroundColor: "red", borderColor: "red" }
            }}
        >
            <p>
                Are you sure you want to delete user <strong>{userToDelete?.fullName}</strong>?
            </p>
        </Modal>
    )
}

DeleteUserModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    userToDelete: PropTypes.object.isRequired
}

export default DeleteUserModal
