import React from "react"

const ErrorMessage = ({ error, touched }) => {
    if (!touched) return null

    return (
        <span style={{ display: 'block', color: "#f44336" }}>{error}</span>
    )
}

export default ErrorMessage