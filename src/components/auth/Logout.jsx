import { React, Button, Col, Row, PiWarningCircleBold, motion, useNavigate } from "../../index"
import AuthAPI from "../../api/AuthApi";

const LogoutModal = ({ show, onClose }) => {
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await AuthAPI.logout(refreshToken);
            if (response.status === 200) {
                navigate('/home');
            } else {
                console.error('Logout failed:', response);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    if (!show) {
        return null
    }

    return (
        <div className="overlay-bg">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="animation"
            >
                <div className="border rounded form-logout">
                    <div>
                        <PiWarningCircleBold className="icon-logout" />
                        <h4 className="pt-3 pb-2">
                            <b>Are you leaving?</b>
                        </h4>
                    </div>
                    <div className="text-muted">
                        <p>
                            Are you sure you want to logout? <br></br>All your unsaved data will be lost.
                        </p>
                    </div>
                    <div>
                        <Row className="pt-4">
                            <Col>
                                <Button variant="outline-primary" onClick={onClose} className="py-2 button-logout">
                                    <b>Cancel</b>
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="primary" onClick={handleLogout} className="px-5 py-2">
                                    <b>Yes</b>
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default LogoutModal
