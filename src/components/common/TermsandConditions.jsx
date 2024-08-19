import React, { useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import "../../assets/scss/Landing.scss"

const TermsModal = ({ show, onAccept, onClose }) => {
    const [isChecked, setIsChecked] = useState(false)
    const [error, setError] = useState("")

    const handleAccept = () => {
        if (isChecked) {
            onAccept()
        } else {
            setError("Please read and tick if you agree with our Terms and Conditions")
        }
    }

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
        if (error) {
            setError("")
        }
    }
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Terms and Conditions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Last updated: 23/7/2024</p>

                <b>1. Introduction</b>
                <p>
                    Welcome to Project Base Java 3. By using our website, you agree to comply with and be bound by the
                    following terms and conditions of use, which together with our privacy policy govern Project Base
                    Java 3's relationship with you in relation to this website.
                </p>

                <b>2. Use of the Website</b>
                <p>
                    The content of the pages of this website is for your general information and use only. It is subject
                    to change without notice.
                </p>

                <b>3. User Account</b>
                <p>
                    To access certain features of the website, you may need to register for an account. You agree to
                    provide accurate, current, and complete information during the registration process and to update
                    such information to keep it accurate, current, and complete.
                </p>

                <b>4. Privacy</b>
                <p>
                    Your use of this website is also subject to our Privacy Policy. Please review our Privacy Policy,
                    which also governs the site and informs users of our data collection practices.
                </p>

                <b>5. Intellectual Property</b>
                <p>
                    All content included on the site, such as text, graphics, logos, images, as well as the compilation
                    thereof, and any software used on the site, is the property of Project Base Java 3 or its suppliers
                    and protected by copyright and other laws that protect intellectual property and proprietary rights.
                </p>

                <b>6. Limitation of Liability</b>
                <p>
                    In no event shall Project Base Java 3, nor its directors, employees, partners, agents, suppliers, or
                    affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages,
                    including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                    resulting from (i) your access to or use of or inability to access or use the service; (ii) any
                    conduct or content of any third party on the service; (iii) any content obtained from the service;
                    and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on
                    warranty, contract, tort (including negligence), or any other legal theory, whether or not we have
                    been informed of the possibility of such damage.
                </p>

                <b>7. Governing Law</b>
                <p>
                    These terms shall be governed and construed in accordance with the laws of [Your Country/State],
                    without regard to its conflict of law provisions.
                </p>

                <b>8. Changes</b>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                    revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                    What constitutes a material change will be determined at our sole discretion.
                </p>

                <b>9. Contact Us</b>
                <p>
                    If you have any questions about these Terms, please contact us: <br />
                    Phone: 0123456789
                    <br />
                    Email: kindergarten@fpt.com
                    <br />
                    Fanpage: https://www.facebook.com/Clkthai003
                </p>
            </Modal.Body>

            <Modal.Footer style={{ justifyContent: "space-between" }}>
                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        label="I agree to the Terms and Conditions"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                    {error && <Form.Text className="text-danger">{error}</Form.Text>}
                </Form.Group>
                <Button variant="primary" onClick={handleAccept} disabled={!isChecked}>
                    Accept
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default TermsModal
