import React from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css" // Import styles
import PropTypes from "prop-types"

const CustomQuillEditor = ({ value, onChange, isDisabled }) => {
    const modules = {
        toolbar: [
            [{ header: ["1", "2", false] }],
            ["bold", "italic", "underline", "strike"],
            ["link", "image", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["clean"]
        ]
    }

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "link",
        "image",
        "blockquote",
        "list",
        "bullet",
        "align"
    ]

    const customStyles = {
        editor: {
            borderRadius: "10px",
            border: "1px solid #ccc",
            padding: "10px",
            fontFamily: "Arial, sans-serif",
            minHeight: "200px",
            backgroundColor: isDisabled ? "#F5F5F5" : "#fefefe"
        },
        toolbar: {
            borderRadius: "10px 10px 0 0",
            border: "1px solid #ccc",
            borderBottom: "none",
            backgroundColor: "#f4f4f4"
        }
    }

    return (
        <div
            style={{
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
            }}
        >
            <ReactQuill
                disabled={isDisabled}
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder="Enter Text Here..."
                style={customStyles.editor}
                theme="snow"
            // readOnly={disabled} // Sử dụng prop readOnly để disable editor
            />

            <style>{`
        .ql-toolbar.ql-snow {
          border-radius: 10px 10px 0 0;
          border: 1px solid #ccc;
          border-bottom: none;
          background-color: #f4f4f4;
          border: none;
          border-radius: 15px;
        }
        .ql-toolbar.ql-snow .ql-formats {
          margin-right: 10px;
        }
        .ql-container.ql-snow {
          border-radius: 0 0 10px 10px;
          border: 1px solid #ccc;
          border-top: none;
          background-color: #F5F5F5;
          border: none;
        }
        .ql-editor {
            background-color: ${isDisabled ? "#F5F5F5 !important" : "#FEFEFE !important"};
        }
      `}</style>
        </div>
    )
}

CustomQuillEditor.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool.isRequired
}

export default CustomQuillEditor
