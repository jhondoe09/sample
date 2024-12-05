import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
function ChatHome() {
    const navigate = useNavigate();
    const apiURL = 'http://localhost:5000';
    const [messages, setMessages] = useState([]);

    useState(() => {
        axios.get(apiURL + "/receive-sms", {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(response => {
                console.log(response);
                if (response.data.length > 0) {
                    setMessages(response.data);
                } else {
                    setMessages([]);
                }
            })
            .catch(error => {
                console.error(error);
            })
    })
    return (
        <div className="container my-5">
            <div className="position-relative p-5 text-muted bg-body border border-dashed rounded-5">
                <h1 className="text-body-emphasis mb-2">SMS</h1>
                <div className="col-md-12 row">
                    <div className="col-md-10"></div>
                    <div className="col-md-2">
                        <button type="button" className="btn btn-outline-secondary"
                            onClick={() => navigate("/sms")}
                        >Compose</button>
                    </div>
                </div>
                <div className="container">
                    <div className="my-3 p-3 bg-body rounded shadow-sm">
                        {messages.map((m, i) => (
                            <div key={i} className="text-body-secondary pt-3">
                                <p className="pb-3 mb-0 small lh-sm border-bottom">
                                    <strong className="d-block text-gray-dark">From: {m.from}</strong>
                                    {m.body}
                                </p>
                            </div>
                        ))}
                        <small className="d-block text-end mt-3">
                            <a href="#">All updates</a>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatHome