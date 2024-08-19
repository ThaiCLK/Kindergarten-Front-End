import React from "react"
import { Row, Input, Form, Select, Button } from "antd"
import { Container } from "react-bootstrap"
import "../../assets/scss/SearchSchoolByUser.scss"

const { Option } = Select
function SearchSchoolByUserComponent() {
    return (
        <Container>
            <div
                style={{
                    backgroundColor: "#495456",
                    height: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Input placeholder="Enter a school name" style={{ width: "400px", borderRadius: "10px 0 0 10px" }} />
                <Select
                    placeholder="City/Provine"
                    style={{
                        width: "200px",
                        borderRadius: "0px",
                        border: "none"
                    }}
                >
                    <Option value="primary">Primary</Option>
                    <Option value="secondary">Secondary</Option>
                    <Option value="high">High</Option>
                </Select>
                <Select
                    placeholder="District"
                    style={{
                        width: "200px",
                        borderRadius: "0px",
                        border: "none"
                    }}
                >
                    <Option value="public">Public</Option>
                    <Option value="private">Private</Option>
                    <Option value="charter">Charter</Option>
                </Select>
                <Button type="primary" style={{ borderRadius: "0 10px 10px 0" }}>
                    Search
                </Button>
            </div>

            <Row style={{ margin: "10px" }}>
                <h6>Home - Search for school</h6>{" "}
            </Row>
            <Row style={{ justifyContent: "center", margin: "10px" }}>
                <h6>Đây là Số lượng A trường hợp với kết quả lọc</h6>
            </Row>
            <Row style={{ justifyContent: "right", margin: "10px" }}>
                <Form.Item>
                    <Select style={{ width: "200px" }} value="By rating">
                        <Option value="Public">Public</Option>
                        <Option value="Private">Private</Option>
                    </Select>
                </Form.Item>
            </Row>
        </Container>
    )
}

export default SearchSchoolByUserComponent
