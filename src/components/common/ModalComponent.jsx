import React, { useState } from "react"
import { Modal, Button } from "antd"
import PropTypes from "prop-types"

const ModalComponent = ({ visible, onCancel, onConfirm, modalTitle, modalContent, buttonLeft, buttonRight }) => {
    const [confirmLoading, setConfirmLoading] = useState(false)

    const handleOk = () => {
        setConfirmLoading(true)
        setTimeout(() => {
            onConfirm()
            setConfirmLoading(false)
        }, 200)
    }

    return (
        <Modal
            title={<strong>{modalTitle}</strong>}
            open={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
            footer={[
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        height: "60px",
                        justifyContent: "flex-end"
                    }}
                >
                    <Button
                        key="cancel"
                        onClick={onCancel}
                        style={{
                            marginRight: "10px",
                            backgroundColor: "white",
                            color: "#5171C8",
                            fontWeight: "bold",
                            border: "none",
                            height: "30px",
                            width: "200px",
                            boxShadow: "0 0 0 0 "
                        }}
                    >
                        {buttonLeft}
                    </Button>
                    <Button key="confirm" type="primary" danger onClick={handleOk} loading={confirmLoading}>
                        {buttonRight}
                    </Button>
                </div>
            ]}
        >
            <div>
                <p style={{ marginBottom: "30px" }}>{modalContent}</p>
            </div>
        </Modal>
    )
}

ModalComponent.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    modalTitle: PropTypes.string.isRequired,
    modalContent: PropTypes.node.isRequired,
    buttonLeft: PropTypes.string.isRequired,
    buttonRight: PropTypes.string.isRequired
}

export default ModalComponent
